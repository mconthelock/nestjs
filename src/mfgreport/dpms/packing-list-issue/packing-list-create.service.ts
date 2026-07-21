import { Injectable } from '@nestjs/common';
import {
    CreatePackingListIssueDto,
    ListPLDto,
} from './dto/create-packing-list-issue.dto';
import { DpmsPlIssueService } from 'src/workload/dpms_pl_issue/dpms_pl_issue.service';
import { PDFService } from 'src/common/services/pdf/pdf.service';
import { now } from 'src/common/utils/dayjs.utils';
import { DpmsPlIssueRevService } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.service';
import { DPMS_PL_ISSUE_PK, IdocRevData } from './packing-list-issue.interface';
import { DpmsPlFileService } from 'src/workload/dpms_pl_file/dpms_pl_file.service';
import { DpmsPlCaseListService } from 'src/workload/dpms_pl_case_list/dpms_pl_case_list.service';
import { DpmsPlCaseListDetailService } from 'src/workload/dpms_pl_case_list_detail/dpms_pl_case_list_detail.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { DpmsPlIssueTypeService } from 'src/workload/dpms_pl_issue_type/dpms_pl_issue_type.service';
import { DpmsPlIssueDateService } from 'src/workload/dpms_pl_issue_date/dpms_pl_issue_date.service';
import { DpmsPlMailService } from 'src/workload/dpms_pl_mail/dpms_pl_mail.service';
import { DpmsPlDocRevService } from 'src/workload/dpms_pl_doc_rev/dpms_pl_doc_rev.service';
import { PackingListIssueService } from './packing-list-issue.service';
import { joinPaths } from 'src/common/utils/files.utils';

@Injectable()
export class PackingListCreateService extends PackingListIssueService {
    constructor(
        protected readonly PDFService: PDFService,
        protected readonly dpmsPlIssueService: DpmsPlIssueService,
        protected readonly dpmsPlIssueRevService: DpmsPlIssueRevService,
        protected readonly dpmsPlFileService: DpmsPlFileService,
        protected readonly dpmsPlCaseListService: DpmsPlCaseListService,
        protected readonly dpmsPlCaseListDetailService: DpmsPlCaseListDetailService,
        protected readonly dpmsPlIssueTypeService: DpmsPlIssueTypeService,
        protected readonly dpmsPlIssueDateService: DpmsPlIssueDateService,
        protected readonly dpmsPlMailService: DpmsPlMailService,
        protected readonly dpmsPlDocRevService: DpmsPlDocRevService,
        protected readonly mailService: MailService,
    ) {
        super(
            PDFService,
            dpmsPlIssueService,
            dpmsPlIssueRevService,
            dpmsPlFileService,
            dpmsPlCaseListService,
            dpmsPlCaseListDetailService,
            dpmsPlIssueTypeService,
            dpmsPlIssueDateService,
            dpmsPlMailService,
            dpmsPlDocRevService,
            mailService,
        );
    }

    async issue(dto: CreatePackingListIssueDto) {
        try {
            const issueDate: string = now('DD/MM/YYYY');
            const finishDate: Date = new Date();

            const issueType = await this.dpmsPlIssueTypeService.findById(
                dto.ISSUETYPE,
            );
            const plIssueData: DPMS_PL_ISSUE_PK = {
                VPROD: dto.VPROD,
                VP: dto.VP,
                VORDERS: dto.VORDERS,
                VTYPE: dto.VTYPE,
            };
            let round: number = dto.PO ? 2 : 1;
            const folderPath: string[] = ['AMEC', 'PO'];
            let docRevision: number = 0;
            let docRevData: IdocRevData = plIssueData;
            let revision: number = 0;
            let revisionText: string = '*';
            let mailObject: {
                subject: string;
                maillist: string[];
                context: any;
                attachments: any[];
            }[] = [];
            let issueRevID: number = null;
            for (let r = 1; r <= round; r++) {
                let finalPath: string = await this.genaratePath({
                    prod: dto.VPROD,
                    orders: dto.VORDERS,
                    folderPath: folderPath[r - 1],
                });

                if (issueType.data.VCODE === 'DF') {
                    finalPath = await joinPaths(finalPath, 'Draft');
                }

                const pdfPath: string = await joinPaths(finalPath, 'pdf');

                if (r == 1) {
                    // 1. หา revision ของชุดเอกสาร และทำการเพิ่มหรืออัปเดต DPMS_PL_ISSUE ตามเงื่อนไขที่กำหนด
                    docRevision = await this.syncDocRevisionAndPlIssue({
                        plIssueData,
                        changeIssueType: dto.CHANGETYPE,
                        revise: dto.REVISE,
                        typeCode: issueType.data.VCODE,
                        recreatedIssue: dto.CHANGELIST || dto.NEWLIST, // ถ้ามีการเปลี่ยนแปลงรายการหรือมีรายการใหม่ ให้ set recreatedIssue เป็น true
                    });

                    // 2. เตรียมข้อมูลสำหรับการสร้าง record ใน DPMS_PL_DOC_REV และ update DFINISHALL ของ record ที่ยังไม่ finish ของเอกสารนี้
                    docRevData = await this.prepareDocRevisionData({
                        typeCode: issueType.data.VCODE,
                        plIssueData,
                        finishDate,
                        docRevision,
                        revise: dto.REVISE,
                        recreatedIssue: dto.CHANGELIST || dto.NEWLIST, // ถ้ามีการเปลี่ยนแปลงรายการหรือมีรายการใหม่ ให้ set recreatedIssue เป็น true
                    });
                    // 3. หา revision ของเอกสาร Packing List Issue สำหรับการสร้าง record ใน DPMS_PL_ISSUE_REV
                    const nextRevision: {
                        revision: number;
                        revisionText: string;
                    } = await this.getNextPlRevision({
                        plIssueData,
                        typeCode: issueType.data.VCODE,
                        typeId: dto.ISSUETYPE,
                    });
                    revision = nextRevision.revision;
                    revisionText = nextRevision.revisionText;
                }
                console.log('revision', revision, 'revisionText', revisionText);

                let NDOCTYPE: number = 0;
                let html: string = dto.HTML;
                let plList: ListPLDto[] = dto.LIST;
                if (r == 2) {
                    NDOCTYPE = 1; // ถ้าเป็น PO ให้ set NDOCTYPE เป็น 1 ถ้าไม่ใช่ให้ set เป็น 0
                    html = dto.POHTML; // ถ้าเป็น PO ให้ใช้ HTML ของ PO ถ้าไม่ใช่ให้ใช้ HTML ของ Packing List
                    plList = dto.POLIST; // ถ้าเป็น PO ให้ใช้ POLIST ถ้าไม่ใช่ให้ใช้ LIST
                }

                // 4. create PDF file
                const fileName: string = this.generateFilename({
                    revision,
                    revisionText,
                    issueType: issueType.data.VDESCRIPTION,
                    orders: dto.VORDERS,
                    projectName: dto.HEADER.VNAMEOFBLDG,
                    PO: NDOCTYPE === 1,
                });
                const pdf: { path: string; data: Buffer } =
                    await this.generatePDF({
                        order: dto.VORDERS,
                        html: html,
                        fileName: fileName,
                        revision: revisionText,
                        issueDate,
                        finalPath: pdfPath,
                    });

                // 5. add file Data to DB
                const insertFile = await this.dpmsPlFileService.create({
                    VFILE_ONAME: fileName,
                    VFILE_FNAME: fileName,
                    VFILE_USERCREATE: dto.VISSUEBY,
                    NFILE_TYPE: dto.ISSUETYPE,
                    VFILE_PATH: pdfPath,
                });

                if (insertFile.status === false) {
                    throw new Error(
                        'Failed to insert packing list file record',
                    );
                }

                // 6. create PL Issue Revision record
                const insertIssueRev = await this.dpmsPlIssueRevService.create({
                    ...plIssueData,
                    NISSUE_TYPE: dto.ISSUETYPE,
                    NREV: revision,
                    VREVTEXT: revisionText,
                    NPDFID: insertFile.data.NFILE_ID,
                    VSHOPORDERNO: dto.HEADER.VSHOPORDERNO,
                    VSUBJECT: dto.HEADER.VSUBJECT,
                    VNAMEOFBLDG: dto.HEADER.VNAMEOFBLDG,
                    VSOLDTO: dto.HEADER.VSOLDTO,
                    VSHIPPINGMARK: dto.SHIPPING_MARK,
                    NROUND: dto.NROUND,
                    VISSUEBY: dto.VISSUEBY,
                    NDOCTYPE: NDOCTYPE,
                });
                if (insertIssueRev.status === false) {
                    throw new Error(
                        'Failed to insert packing list issue revision record',
                    );
                }
                console.log('insert Issue rev', insertIssueRev.data);

                // 7. insert record to DPMS_PL_DOC_REV for this issue
                if (r == 1) {
                    issueRevID = insertIssueRev.data.NID;
                    await this.saveDocRevision({
                        typeCode: issueType.data.VCODE,
                        docRevData,
                        issueRevID: issueRevID,
                        revise: dto.REVISE,
                        reviseID: dto.REVISEID,
                        recreatedIssue: dto.CHANGELIST || dto.NEWLIST, // ถ้ามีการเปลี่ยนแปลงรายการหรือมีรายการใหม่ ให้ set recreatedIssue เป็น true
                    });
                } else {
                    // เมื่อสร้าง PO แล้ว ให้ update NPOID ของ record ที่สร้างเมื่อรอบแรก
                    await this.dpmsPlDocRevService.update(
                        {
                            ...plIssueData,
                            NISSUEREV_ID: issueRevID,
                        },
                        { NPOID: insertIssueRev.data.NID },
                    );
                }


                // 9. Create PL Issue List record
                for (const list of plList) {
                    const seq: number = plList.indexOf(list) + 1;
                    const insertIssueList =
                        await this.dpmsPlCaseListService.create({
                            ...list,
                            NISSUEREV_ID: insertIssueRev.data.NID,
                            NSEQ: seq,
                        });
                    // 10. Create PL Issue List Detail record
                    for (const detail of list.DETAILS) {
                        await this.dpmsPlCaseListDetailService.create({
                            ...detail,
                            NCASELIST_ID: insertIssueList.data.NID,
                        });
                    }
                }

                // 11. send email notification to admin
                mailObject.push({
                    subject: `${now('YYYY-MM-DD HH:mm:ss')} Packing list issue notification [${dto.VORDERS}] REV. ${revisionText} (${issueType.data.VDESCRIPTION})`,
                    maillist: [process.env.MAIL_ADMIN],
                    context: {
                        rev: revisionText,
                        issueType: issueType.data.VDESCRIPTION,
                        shopOrderNo: dto.HEADER.VSHOPORDERNO,
                        subject: dto.HEADER.VSUBJECT,
                        nameOfBldg: dto.HEADER.VNAMEOFBLDG,
                        soldTo: dto.HEADER.VSOLDTO,
                        path: pdf.path,
                    },
                    attachments: [
                        {
                            filename: fileName,
                            content: pdf.data,
                        },
                    ],
                });
            }
            // throw new Error('Test error'); // ลองทดสอบ error handling

            for (const mail of mailObject) {
                await this.sendMail(mail);
            }
            // 12. Get issue date from DPMS_PL_ISSUE_DATE view for update dataTable
            const issueData =
                await this.dpmsPlIssueDateService.findOne(plIssueData);
            if (!issueData.status) {
                throw new Error('Failed to find DPMS PL Issue Date');
            }
            return {
                status: true,
                message: 'Packing list issued successfully',
                data: issueData.data,
            };
        } catch (error) {
            throw new Error(`Failed to issue packing list: ${error.message}`);
        }
    }
}
