import { Injectable } from '@nestjs/common';
import { CreatePackingListIssueDto } from './dto/create-packing-list-issue.dto';
import { UpdatePackingListIssueDto } from './dto/update-packing-list-issue.dto';
import { DpmsPlIssueService } from 'src/workload/dpms_pl_issue/dpms_pl_issue.service';
import { PDFService } from 'src/common/services/pdf/pdf.service';
import { joinPaths } from 'src/common/utils/files.utils';
import { now } from 'src/common/utils/dayjs.utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs/promises';
import { DpmsPlIssueRevService } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.service';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';
import {
    DPMS_PL_ISSUE_PK,
    generatePDFParams,
} from './packing-list-issue.interface';
import { DpmsPlFileService } from 'src/workload/dpms_pl_file/dpms_pl_file.service';
import { DpmsPlCaseListService } from 'src/workload/dpms_pl_case_list/dpms_pl_case_list.service';
import { DpmsPlCaseListDetailService } from 'src/workload/dpms_pl_case_list_detail/dpms_pl_case_list_detail.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { DpmsPlIssueTypeService } from 'src/workload/dpms_pl_issue_type/dpms_pl_issue_type.service';

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
        private readonly mailService: MailService,
    ) {}

    private readonly tempDir = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/tmp/`;
    private readonly finalDir = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/test/`;

    async issue(dto: CreatePackingListIssueDto) {
        try {
            const issueDate = now('DD/MM/YYYY');
            const issueType = await this.dpmsPlIssueTypeService.findById(
                dto.ISSUETYPE,
            );
            // 1. Check if PL Issue exists, if not create new PL Issue
            const plIssueData: DPMS_PL_ISSUE_PK = {
                VPROD: dto.VPROD,
                VP: dto.VP,
                VORDERS: dto.VORDERS,
                VTYPE: dto.VTYPE,
            };
            const checkPlIssue =
                await this.dpmsPlIssueService.findOne(plIssueData);
            if (!checkPlIssue.status) {
                await this.dpmsPlIssueService.create(plIssueData);
            }
            // 2. Get next revision number
            const revision: number =
                await this.dpmsPlIssueRevService.getNextRevision({
                    ...plIssueData,
                    NISSUE_TYPE: dto.ISSUETYPE,
                });
            const revisionText: string = numberToAlphabetRevision(revision);

            // 3. create PDF file
            const fileName: string = `${dto.HEADER.VNAMEOFBLDG.split(' ')[0] ?? ''}_${dto.VORDERS}${revision > 0 ? `_${revisionText}` : ''}.pdf`;
            const pdf = await this.generatePDF({
                order: dto.VORDERS,
                html: dto.HTML,
                fileName,
                revision: revisionText,
                issueDate,
            });

            // 3. add file Data to DB
            const insertFile = await this.dpmsPlFileService.create({
                VFILE_ONAME: fileName,
                VFILE_FNAME: fileName,
                VFILE_USERCREATE: 'system',
                NFILE_TYPE: dto.ISSUETYPE,
                VFILE_PATH: this.finalDir,
            });

            if (insertFile.status === false) {
                throw new Error('Failed to insert packing list file record');
            }

            // 4. create PL Issue Revision record
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
            });

            // 5. Create PL Issue List record
            for (const list of dto.LIST) {
                const seq = dto.LIST.indexOf(list) + 1;
                const insertIssueList = await this.dpmsPlCaseListService.create(
                    {
                        ...list,
                        NISSUEREV_ID: insertIssueRev.data.NID,
                        NSEQ: seq,
                    },
                );
                // 6. Create PL Issue List Detail record
                for (const detail of list.DETAILS) {
                    await this.dpmsPlCaseListDetailService.create({
                        ...detail,
                        NCASELIST_ID: insertIssueList.data.NID,
                    });
                }
            }
            // 7. send email notification to user
            const email =
                process.env.NODE_ENV != 'production'
                    ? process.env.MAIL_ADMIN
                    : process.env.MAIL_ADMIN;
            await this.mailService.sendMail({
                from: `MFG REPORT System<${process.env.MAIL_FROM}>`,
                to: email,
                subject: 'Packing list issue notification',
                template: 'mfgreport/dpms/packing-list',
                context: {
                    name: email,
                    issueType: issueType.data.VDESCRIPTION,
                    shopOrderNo: dto.HEADER.VSHOPORDERNO,
                    subject: dto.HEADER.VSUBJECT,
                    nameOfBldg: dto.HEADER.VNAMEOFBLDG,
                    soldTo: dto.HEADER.VSOLDTO,
                    path: pdf.path,
                },
                bcc: process.env.MAIL_ADMIN,
                attachments: [
                    {
                        filename: fileName,
                        content: pdf.data,
                    },
                ],
            });
            // throw new Error('Test error');
            return {
                status: true,
                message: 'Packing list issued successfully',
            };
        } catch (error) {
            throw new Error(`Failed to issue packing list: ${error.message}`);
        }
    }

    private async generatePDF({
        order,
        html,
        fileName,
        revision,
        issueDate,
    }: generatePDFParams) {
        const orderText = order.replace(/^(.)(..)(.....)(.)$/, '$1-$2-$3-$4');
        const tempFileName = `tempPL_${now('YYYYMMDDHHmm')}_${fileName}`;
        const tempFilePath = await joinPaths(this.tempDir, tempFileName);
        const finalFilePath = await joinPaths(this.finalDir, fileName);
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
                            #pl-header #pl-info {
                                display: grid;
                                grid-template-columns: auto auto 1fr;
                                gap: 1rem;
                            }
                            #pl-header #pl-info div:not(#shipping-mark) {
                                display: flex;
                                flex-direction: column;
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
        await this.addHeaderToPDF(tempFilePath, finalFilePath, orderText);

        // 3. ลบ temp file
        await fs.unlink(tempFilePath);
        return { ...pdf, path: finalFilePath };
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
            await fs.writeFile(outputPath, pdfBytes);
        } catch (error) {
            throw new Error(`Failed to add header to PDF: ${error.message}`);
        }
    }
}
