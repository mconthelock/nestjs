import { Injectable } from '@nestjs/common';
import { CreatePackingListIssueDto } from './dto/create-packing-list-issue.dto';
import {
    UpdatePackingListIssueDto,
    UpdatePlIssueProblemReasonDto,
} from './dto/update-packing-list-issue.dto';
import { DpmsPlIssueService } from 'src/workload/dpms_pl_issue/dpms_pl_issue.service';
import { PDFService } from 'src/common/services/pdf/pdf.service';
import { joinPaths } from 'src/common/utils/files.utils';
import { now } from 'src/common/utils/dayjs.utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs/promises';
import { DpmsPlIssueRevService } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.service';
import {
    convertJung,
    numberToAlphabetRevision,
} from 'src/common/utils/format.utils';
import {
    DPMS_PL_ISSUE_PK,
    generatePDFParams,
    sendMailParams,
} from './packing-list-issue.interface';
import { DpmsPlFileService } from 'src/workload/dpms_pl_file/dpms_pl_file.service';
import { DpmsPlCaseListService } from 'src/workload/dpms_pl_case_list/dpms_pl_case_list.service';
import { DpmsPlCaseListDetailService } from 'src/workload/dpms_pl_case_list_detail/dpms_pl_case_list_detail.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { DpmsPlIssueTypeService } from 'src/workload/dpms_pl_issue_type/dpms_pl_issue_type.service';
import { DpmsPlIssueDateService } from 'src/workload/dpms_pl_issue_date/dpms_pl_issue_date.service';
import path from 'path';
import { DpmsPlMailService } from 'src/workload/dpms_pl_mail/dpms_pl_mail.service';
import { DpmsPlDocRevService } from 'src/workload/dpms_pl_doc_rev/dpms_pl_doc_rev.service';

@Injectable()
export class PackingListIssueService {
    constructor(
        private readonly PDFService: PDFService,
        private readonly dpmsPlIssueService: DpmsPlIssueService,
        private readonly dpmsPlIssueRevService: DpmsPlIssueRevService,
        private readonly dpmsPlFileService: DpmsPlFileService,
        private readonly dpmsPlCaseListService: DpmsPlCaseListService,
        private readonly dpmsPlCaseListDetailService: DpmsPlCaseListDetailService,
        private readonly dpmsPlIssueTypeService: DpmsPlIssueTypeService,
        private readonly dpmsPlIssueDateService: DpmsPlIssueDateService,
        private readonly dpmsPlMailService: DpmsPlMailService,
        private readonly dpmsPlDocRevService: DpmsPlDocRevService,
        private readonly mailService: MailService,
    ) {}

    private readonly tempDir = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/tmp/`;
    private readonly finalDir = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/mfgreport/packing-list/`;

    async updateProblemReason(dto: UpdatePlIssueProblemReasonDto) {
        try {
            const { VPROD, VP, VORDERS, VTYPE, ...data } = dto;
            const condition = {
                VPROD,
                VP,
                VORDERS,
                VTYPE,
            };
            const checkPlIssue =
                await this.dpmsPlIssueService.findOne(condition);
            if (!checkPlIssue.status) {
                return await this.dpmsPlIssueService.create({
                    ...condition,
                    ...data,
                });
            } else {
                return await this.dpmsPlIssueService.update(condition, data);
            }
        } catch (error) {
            throw new Error(
                `Failed to update problem reason: ${error.message}`,
            );
        }
    }

    async issue(dto: CreatePackingListIssueDto) {
        try {
            const issueDate = now('DD/MM/YYYY');
            const issueType = await this.dpmsPlIssueTypeService.findById(
                dto.ISSUETYPE,
            );

            const converted = convertJung(dto.VPROD);
            if (!converted) {
                throw new Error('Invalid VPROD format for converting Jung');
            }
            const fyear = converted.substring(0, 4);
            const jung = converted.slice(4);
            const finalPath = await joinPaths(
                this.finalDir,
                fyear,
                jung,
                dto.VORDERS,
                // issueType.data.VDESCRIPTION,
            );

            // 1. Check if PL Issue exists, if not create new PL Issue
            const plIssueData: DPMS_PL_ISSUE_PK = {
                VPROD: dto.VPROD,
                VP: dto.VP,
                VORDERS: dto.VORDERS,
                VTYPE: dto.VTYPE,
            };
            let docRevision: number = 0;
            const finishDate = new Date();
            let docRevData: any = plIssueData;
            let updateDocFinishAll = [];

            const checkPlIssue =
                await this.dpmsPlIssueService.findOne(plIssueData);
            console.log('check pl issue', checkPlIssue);
            
            // ถ้าไม่มี record ให้สร้างใหม่ และ set NDOCREV เป็น 0
            if (!checkPlIssue.status) {
                console.log('condition 1 ');
                
                await this.dpmsPlIssueService.create({
                    ...plIssueData,
                    NDOCREV: docRevision,
                });
            }
            // ถ้ามี record อยู่แล้ว ให้เช็คว่า DFINISHALL เป็น null หรือไม่ ถ้าไม่เป็น null ให้เพิ่ม docRevision ขึ้น 1 และ set DFINISHALL เป็น null และ update NDOCREV เป็น docRevision ใหม่
            else if (checkPlIssue.data.DFINISHALL) {
                console.log('condition 2 ');
                docRevision = checkPlIssue.data.NDOCREV + 1; // เพิ่ม revision ของเอกสาร
                await this.dpmsPlIssueService.update(plIssueData, {
                    DFINISHALL: null,
                    NDOCREV: docRevision,
                });
            } else {
                console.log('condition 3 ');
                docRevision = checkPlIssue.data.NDOCREV;
            }
            // throw new Error('Test error');
            // 2. ถ้าเป็น complete, combine, balance ให้ set DFINISHALL เป็นวันที่ issue เลย
            if (['CP', 'CB', 'BL'].includes(issueType.data.VCODE)) {
                await this.dpmsPlIssueService.update(plIssueData, {
                    DFINISHALL: finishDate,
                    NDOCREV: docRevision,
                });
                docRevData = {
                    ...docRevData,
                    NREV: docRevision,
                    DFINISHALL: finishDate,
                };
                // ดึงรายการ ที่ยังไม่ finish ของเอกสารนี้ เพื่อ update DFINISHALL เป็นวันที่ issue
                const pendingRecord =
                    await this.dpmsPlDocRevService.getPendingRecord(
                        plIssueData,
                    );
                if (pendingRecord.status) {
                    updateDocFinishAll = pendingRecord.data;
                }
            } else {
                docRevData = {
                    ...docRevData,
                    NREV: docRevision,
                };
            }
            console.log('docrev data', docRevData);
            // throw new Error('Test error');
            

            // 3. Get next revision number
            // 2026-06-27 เปลี่ยนเอา type และ round ออกจาก condition เพราะ revision จะไม่ขึ้นกับ type และ round แล้ว รันต่อเนื่องได้เลย
            const revision: number =
                await this.dpmsPlIssueRevService.getNextRevision({
                    ...plIssueData,
                    // NISSUE_TYPE: dto.ISSUETYPE,
                    // NROUND: dto.NROUND,
                });
            const revisionText: string = numberToAlphabetRevision(revision);

            // 4. create PDF file
            const fileName: string = `${dto.HEADER.VNAMEOFBLDG}_${dto.VORDERS}${revision > 0 ? `_${revisionText}` : ''}_${issueType.data.VDESCRIPTION}.pdf`;
            console.log('filename', fileName);

            const newFileName: string = fileName.replace(/[\\/:*?"<>|]/g, '_');
            const pdf = await this.generatePDF({
                order: dto.VORDERS,
                html: dto.HTML,
                fileName: newFileName,
                revision: revisionText,
                issueDate,
                finalPath,
            });

            // 5. add file Data to DB
            const insertFile = await this.dpmsPlFileService.create({
                VFILE_ONAME: newFileName,
                VFILE_FNAME: newFileName,
                VFILE_USERCREATE: 'system',
                NFILE_TYPE: dto.ISSUETYPE,
                VFILE_PATH: finalPath,
            });

            if (insertFile.status === false) {
                throw new Error('Failed to insert packing list file record');
            }

            // 6. create PL Issue Revision record
            const insertIssueRev = await this.dpmsPlIssueRevService.create({
                ...plIssueData,
                NISSUE_TYPE: dto.ISSUETYPE,
                NREV: revision,
                VREVTEXT: revisionText,
                NFILEID: insertFile.data.NFILE_ID,
                VSHOPORDERNO: dto.HEADER.VSHOPORDERNO,
                VSUBJECT: dto.HEADER.VSUBJECT,
                VNAMEOFBLDG: dto.HEADER.VNAMEOFBLDG,
                VSOLDTO: dto.HEADER.VSOLDTO,
                VSHIPPINGMARK: dto.SHIPPING_MARK,
                NROUND: dto.NROUND,
                VISSUEBY: dto.VISSUEBY,
            });
            if (insertIssueRev.status === false) {
                throw new Error(
                    'Failed to insert packing list issue revision record',
                );
            }

            // 7. insert record to DPMS_PL_DOC_REV for this issue
            await this.dpmsPlDocRevService.create({
                ...docRevData,
                NISSUEREV_ID: insertIssueRev.data.NID,
            });

            // 8. update DFINISHALL for pending records if any
            if (updateDocFinishAll.length > 0) {
                for (const record of updateDocFinishAll) {
                    await this.dpmsPlDocRevService.create({
                        ...record,
                        DFINISHALL: finishDate,
                    });
                }
            }

            // 7. Create PL Issue List record
            for (const list of dto.LIST) {
                const seq = dto.LIST.indexOf(list) + 1;
                const insertIssueList = await this.dpmsPlCaseListService.create(
                    {
                        ...list,
                        NISSUEREV_ID: insertIssueRev.data.NID,
                        NSEQ: seq,
                    },
                );
                // 8. Create PL Issue List Detail record
                for (const detail of list.DETAILS) {
                    await this.dpmsPlCaseListDetailService.create({
                        ...detail,
                        NCASELIST_ID: insertIssueList.data.NID,
                    });
                }
            }
            // 9. send email notification to admin
            await this.sendMail({
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
                        filename: newFileName,
                        content: pdf.data,
                    },
                ],
            });
            // 10. Get issue date from DPMS_PL_ISSUE_DATE view for update dataTable
            const issueData =
                await this.dpmsPlIssueDateService.findOne(plIssueData);
            if (!issueData.status) {
                throw new Error('Failed to find DPMS PL Issue Date');
            }
            // throw new Error('Test error');
            return {
                status: true,
                message: 'Packing list issued successfully',
                data: issueData.data,
            };
        } catch (error) {
            throw new Error(`Failed to issue packing list: ${error.message}`);
        }
    }

    protected async sendMail({
        maillist,
        context,
        attachments,
        subject = `Packing list issue notification`,
    }: sendMailParams) {
        const mails = await this.dpmsPlMailService.findAll();
        if (!mails.status) {
            throw new Error('Failed to retrieve email addresses');
        }
        const email =
            process.env.NODE_ENV != 'production'
                ? process.env.MAIL_ADMIN
                : maillist; //mails.data.map((mail) => mail.VEMAIL_ADDRESS);
        const state = process.env.STATE != 'production' ? '(TEST)' : '';
        await this.mailService.sendMail({
            from: `MFG REPORT System<${process.env.MAIL_FROM}>`,
            to: email,
            subject: `${subject} ${state}`,
            template: 'mfgreport/dpms/packing-list',
            context: {
                // name: email,
                rev: context.rev,
                issueType: context.issueType,
                shopOrderNo: context.shopOrderNo,
                subject: context.subject,
                nameOfBldg: context.nameOfBldg,
                soldTo: context.soldTo,
                path: context.path,
            },
            bcc: process.env.MAIL_ADMIN,
            attachments: attachments,
        });
    }

    private async generatePDF({
        order,
        html,
        fileName,
        revision,
        issueDate,
        finalPath,
    }: generatePDFParams) {
        const orderText = order.replace(/^(.)(..)(.....)(.)$/, '$1-$2-$3-$4');
        const tempFileName = `tempPL_${now('YYYYMMDDHHmm')}_${fileName}`;
        const tempFilePath = await joinPaths(this.tempDir, tempFileName);
        const finalFilePath = await joinPaths(finalPath, fileName);
        const pdf = await this.PDFService.generatePDF({
            html: `<!doctype html>
                <html lang="th">
                    <head>
                        <meta charset="utf-8"/>
                        <meta name="viewport" content="width=device-width,initial-scale=1"/>
                        <style>
                            html, body {
                                background: #fff !important;
                                font-family: "Courier New", monospace;
                                font-size: 12px;
                            }
                            .order-text:first-of-type {
                                display:none;
                            }
                            #pl-header {
                                display: flex;
                                flex-direction: column;
                                gap: 1.25rem;
                            }
                            #pl-header #pl-company-name {
                                // font-size: 1.125rem;
                                font-weight: bold;
                                text-align: center;
                            }
                            #pl-header #pl-title {
                                display: grid;
                                grid-template-columns: repeat(3, minmax(0, 1fr));
                                font-weight: bold;
                                // font-size: 1.125rem;
                                text-align: center;
                            }
                            #pl-header #pl-title #pl-type {
                                display: flex;
                                justify-content: center;
                                gap: .75rem;
                            }
                            #pl-header #pl-info {
                                display: grid;
                                grid-template-columns: 65% 35%;
                                gap: 1rem;
                            }
                            #pl-header #pl-info div:not(#shipping-mark) {
                                display: grid;
                                grid-template-columns: 20% 80%;
                                gap: 1.25rem;
                                padding-top: 3.75rem;
                            }
                            #pl-header #pl-info #shipping-mark {
                                display: flex;
                                justify-content: end;
                            }
                            #pl-header #pl-info #shipping-mark div{
                                display: flex;
                                flex-direction: column;
                                text-align: center;
                                padding-top: 0;
                                padding-right: 20%;
                                gap: 0;
                                width: 100%;
                            }
                            #pl-header #pl-summary {
                                display: grid;
                                grid-template-columns: auto 1fr auto 1fr auto 1fr;  
                                column-gap: 1.5rem;
                                row-gap: 1rem;
                                align-items: center;
                            }
                            table {
                                margin-top: 1.25rem;
                            }
                            table, th {
                                border: 1px dashed #000;
                                border-collapse: collapse;
                            }
                            th, td {
                                vertical-align: top;
                            }
                            th {
                                text-align: center;
                                padding: 1rem;
                                font-weight: normal;
                            }
                            td {
                                border-style: dashed;
                                border-width: 1px;
                                border-top: none;
                                border-bottom: none;
                                padding-left: 0.5rem;
                                padding-right: 0.5rem;
                            }
                            td:nth-child(2) {
                                white-space: nowrap;
                            }
                            td .description {
                                display: grid;
                                grid-template-columns: 50px 130px 140px;
                                gap: 0.5rem;    
                            }
                            td .description .drawing {
                                display: flex;
                                flex-direction: column;
                                overflow-wrap: break-word;
                            }
                            .text-center {
                                text-align: center;
                            }
                            .text-right {
                                text-align: right;
                            }
                            #remark{
                                margin-top: 1.25rem;
                            }
                            #combine-block{
                                display: grid;
                                grid-template-columns: 60px 90px 40px 20px 80px 100px 1fr;
                                gap: 0.5rem;
                            }
                            #change-block{
                                display: grid;
                                grid-template-columns: 60px 60px 30px 40px 30px 20px 20px 1fr;
                                gap: 0.5rem;
                            }
                        </style>
                    </head>
                    <body>
                        ${html}
                    </body>
                </html>`,
            options: {
                path: tempFilePath,
                printBackground: true,
                displayHeaderFooter: true,
                headerTemplate: ` 
                    <div style="
                        width:100%;
                        font-size:10px;
                        padding:0 20px;
                        text-align:right;
                    ">
                        <span class="pageNumber"></span>
                        /
                        <span class="totalPages"></span>
                    </div>`,
                footerTemplate: `
                    <div style="
                        width:100%;
                        font-size:10px;
                        padding-right: 100px;
                        text-align:right;
                    "><span>${issueDate} REV. ${revision}</span>
                    </div>`,
                margin: {
                    top: '10mm',
                    right: '2mm',
                    bottom: '10mm',
                    left: '2mm',
                },
            },
        });
        // 2. ใช้ pdf-lib เพิ่ม header ในหน้า 2 เป็นต้นไป
        const newPdf = await this.addHeaderToPDF(
            tempFilePath,
            finalFilePath,
            orderText,
        );

        // 3. ลบ temp file
        await fs.unlink(tempFilePath);
        return newPdf;
    }

    private async addHeaderToPDF(
        inputPath: string,
        outputPath: string,
        orderText: string,
    ) {
        try {
            // อ่าน PDF file
            const existingPdfBytes = await fs.readFile(inputPath);
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            // โหลด font
            const font = await pdfDoc.embedFont(StandardFonts.Courier);

            const pages = pdfDoc.getPages();
            const totalPages = pages.length;

            // เพิ่ม header ในทุกหน้ายกเว้นหน้าแรก (index 0)
            for (let i = 0; i < totalPages; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();

                // วาด text ที่มุมขวาบน
                if (i > 0) {
                    page.drawText(orderText, {
                        x: width - 150, // ปรับตำแหน่ง
                        y: height - 21.5, // ปรับตำแหน่ง (20px จากบน)
                        size: 9,
                        font: font,
                        color: rgb(0, 0, 0),
                    });
                }
                // footer table
                page.drawText(
                    i === totalPages - 1 ? '-- END --' : ' - CONTINUE -',
                    {
                        x: width / 2 - 30, // ปรับตำแหน่ง
                        y: 20, // ปรับตำแหน่ง (20px จากล่าง)
                        size: 9,
                        font: font,
                        color: rgb(0, 0, 0),
                    },
                );
            }

            // บันทึก PDF
            const pdfBytes = await pdfDoc.save();
            const destination = path.dirname(outputPath);
            await fs.mkdir(destination, { recursive: true });
            await fs.writeFile(outputPath, pdfBytes);
            return { path: outputPath, data: Buffer.from(pdfBytes) };
        } catch (error) {
            throw new Error(`Failed to add header to PDF: ${error.message}`);
        }
    }
}
