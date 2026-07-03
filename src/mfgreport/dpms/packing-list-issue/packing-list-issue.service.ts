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
    type generateFilenameParams,
    type prepareDocRevisionDataParams,
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

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description Generate final path for PDF file based on VPROD and VORDERS
     * @typedef genaratePdfPath
     * @property {string} prod e.g. 2026021
     * @property {string} order e.g. EXS916013
     * @returns {Promise<string>} finalPath e.g. \\amecnas\AMECWEB\File\development\mfgreport\packing-list\2026\02X\EXS916013
     * @example
     * const finalPath = await this.genaratePdfPath({
     *   prod: '2026021',
     *   orders: 'EXS916013',
     * });
     * console.log(finalPath);  // \\amecnas\AMECWEB\File\development\mfgreport\packing-list\2026\02X\EXS916013
     */
    protected async genaratePdfPath({
        prod,
        orders,
    }: {
        prod: string;
        orders: string;
    }): Promise<string> {
        const converted = convertJung(prod);
        if (!converted) {
            throw new Error('Invalid VPROD format for converting Jung');
        }
        const fyear = converted.substring(0, 4);
        const jung = converted.slice(4);
        const finalPath = await joinPaths(
            this.finalDir,
            fyear,
            jung,
            orders,
            // issueType.data.VDESCRIPTION,
        );
        return finalPath;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description
     * เช็คเอกสาร Packing List Issue ว่ามี record อยู่แล้วหรือไม่
     * ถ้าไม่มีให้สร้างใหม่ และ set NDOCREV เป็น 0
     * ถ้ามีอยู่แล้ว ให้เช็คว่า DFINISHALL เป็น null หรือไม่
     *      ถ้าไม่เป็น null ให้เพิ่ม docRevision ขึ้น 1 และ set DFINISHALL เป็น null และ update NDOCREV เป็น docRevision ใหม่
     *      ถ้าเป็น null ให้ใช้ docRevision เดิม
     * @param plIssueData
     * @returns
     * @example
     * const docRevision = await this.syncDocRevisionAndPlIssue({
     *      VPROD: '2026021',
     *      VP: 'P3',
     *      VORDERS: 'EXS916013',
     *      VTYPE: 'ELE',
     * });
     *
     */
    protected async syncDocRevisionAndPlIssue(
        plIssueData: DPMS_PL_ISSUE_PK,
    ): Promise<number> {
        let docRevision: number = 0;

        const checkPlIssue = await this.dpmsPlIssueService.findOne(plIssueData);

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
        return docRevision;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description เตรียมข้อมูลสำหรับการสร้าง record ใน DPMS_PL_DOC_REV และ update DFINISHALL ของ record ที่ยังไม่ finish ของเอกสารนี้
     * @param prepareDocRevisionDataParams
     * @returns
     * @example
     * const docRevData = await this.prepareDocRevisionData({
     *      typeCode: 'CP',
     *      plIssueData: {
     *          VPROD: '2026021',
     *          VP: 'P3',
     *          VORDERS: 'EXS916013',
     *          VTYPE: 'ELE',
     *      },
     *      finishDate: new Date(),
     *      docRevision: 0
     * });
     */
    protected async prepareDocRevisionData({
        typeCode,
        plIssueData,
        finishDate,
        docRevision,
    }: prepareDocRevisionDataParams): Promise<{
        docRevData: any;
    }> {
        let docRevData: any = plIssueData;
        // 2. ถ้าเป็น complete, combine, balance ให้ set DFINISHALL เป็นวันที่ issue เลย
        if (['CP', 'CB', 'BL'].includes(typeCode)) {
            docRevData = {
                ...docRevData,
                NREV: docRevision,
                DFINISHALL: finishDate,
            };
        } else {
            docRevData = {
                ...docRevData,
                NREV: docRevision,
            };
        }
        return docRevData;
    }

    protected async saveDocRevision({
        typeCode,
        finishDate,
        docRevData,
        issueRevID,
    }: {
        typeCode: string;
        finishDate: Date;
        docRevData: any;
        issueRevID: number;
    }) {
        const plIssueData = {
            VPROD: docRevData.VPROD,
            VP: docRevData.VP,
            VORDERS: docRevData.VORDERS,
            VTYPE: docRevData.VTYPE,
        };
        // ถ้า typeCode ไม่ใช่ Draft ให้สร้าง record ใน DPMS_PL_DOC_REV และ update DFINISHALL ของ record ที่ยังไม่ finish ของเอกสารนี้
        if (typeCode !== 'DF') {
            await this.dpmsPlDocRevService.create({
                ...docRevData,
                NISSUEREV_ID: issueRevID,
            });

            // 8. update DFINISHALL for pending records if any
            if (['CP', 'CB', 'BL'].includes(typeCode)) {
                // ดึงรายการ ที่ยังไม่ finish ของเอกสารนี้ เพื่อ update DFINISHALL เป็นวันที่ issue
                const pendingRecord =
                    await this.dpmsPlDocRevService.getPendingRecord(
                        plIssueData,
                    );
                if (pendingRecord.status) {
                    for (const record of pendingRecord.data) {
                        await this.dpmsPlDocRevService.create({
                            ...record,
                            DFINISHALL: finishDate,
                        });
                    }
                }
                await this.dpmsPlIssueService.update(plIssueData, {
                    DFINISHALL: finishDate,
                    NDOCREV: docRevData.NREV,
                });
            }
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description หา revision ของเอกสาร Packing List Issue สำหรับการสร้าง record ใน DPMS_PL_ISSUE_REV
     * @param plIssueData
     * @returns
     */
    protected async getNextPlRevision(
        plIssueData: DPMS_PL_ISSUE_PK,
    ): Promise<{ revision: number; revisionText: string }> {
        // 2026-06-27 เปลี่ยนเอา type และ round ออกจาก condition เพราะ revision จะไม่ขึ้นกับ type และ round แล้ว รันต่อเนื่องได้เลย
        const revision: number =
            await this.dpmsPlIssueRevService.getNextRevision({
                ...plIssueData,
                // NISSUE_TYPE: dto.ISSUETYPE,
                // NROUND: dto.NROUND,
            });
        const revisionText: string = numberToAlphabetRevision(revision);
        return { revision, revisionText };
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description สร้างชื่อไฟล์สำหรับเอกสาร Packing List Issue
     * @param generateFilenameParams
     * @returns
     * @example
     * const fileName = this.generateFilename({
     *      revision: 0,
     *      revisionText: 'A',
     *      issueType: 'Partial',
     *      orders: 'EXS916013',
     *      projectName: 'GR425-25A IATRIKO MAROUSI'
     * });
     * console.log(fileName); // GR425-25A IATRIKO MAROUSI_EXS916013_A_Partial.pdf
     */
    protected generateFilename({
        revision,
        revisionText,
        issueType,
        orders,
        projectName,
    }: generateFilenameParams): string {
        const fileName: string = `${projectName}_${orders}${revision > 0 ? `_${revisionText}` : ''}_${issueType}.pdf`;
        const newFileName: string = fileName.replace(/[\\/:*?"<>|]/g, '_');
        return newFileName;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description ส่งอีเมลแจ้งเตือนการออกเอกสาร Packing List Issue
     * @param sendMailParams
     * @returns
     * @example
     * await this.sendMail({
     *      maillist: ['sutthipongt@MitsubishiElevatorAsia.co.th'],
     *      context: {
     *          rev: 'A',
     *          issueType: 'Partial',
     *          shopOrderNo: 'E-XS-91601-3',
     *          subject: 'ELEVATOR (02X)G11L11',
     *          nameOfBldg: 'GR425-25A IATRIKO MAROUSI',
     *          soldTo: 'GR425-25A IATRIKO MAROUSI',
     *          path: '\\amecnas\AMECWEB\File\development\mfgreport\packing-list\2026\02X\EXS916013\GR425-25A IATRIKO MAROUSI_EXS916013_A_Partial.pdf',
     *      },
     *      attachments: [
     *        { filename: 'GR425-25A IATRIKO MAROUSI_EXS916013_A_Partial.pdf', content: <Buffer> },
     *      ],
     * });
     */
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

    protected async generatePDF({
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
