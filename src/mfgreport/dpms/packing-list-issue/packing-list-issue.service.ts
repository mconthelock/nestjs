import { Injectable } from '@nestjs/common';
import { CreatePackingListIssueDto } from './dto/create-packing-list-issue.dto';
import { UpdatePackingListIssueDto } from './dto/update-packing-list-issue.dto';
import { DpmsPlIssueService } from 'src/workload/dpms_pl_issue/dpms_pl_issue.service';
import { PDFService } from 'src/common/services/pdf/pdf.service';
import { joinPaths } from 'src/common/utils/files.utils';
import { now } from 'src/common/utils/dayjs.utils';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs/promises';

@Injectable()
export class PackingListIssueService {
    constructor(
        private readonly dpmsPlIssueService: DpmsPlIssueService,
        private readonly PDFService: PDFService,
    ) {}
    async issue(dto: CreatePackingListIssueDto) {
        try {
            // 1. Check if PL Issue exists, if not create new PL Issue
            const plIssueData = {
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
            // 2.
            const fileName = `${dto.HEADER.VNAMEOFBLDG.split(' ')[0] ?? ''}_${dto.VORDERS}.pdf`;
            await this.generatePDF(dto.VORDERS, dto.HTML, fileName);
            return {
                status: true,
                message: 'Packing list issued successfully',
            };
        } catch (error) {
            throw new Error(`Failed to issue packing list: ${error.message}`);
        }
    }

    private async generatePDF(order: string, html: string, fileName: string) {
        const orderText = order.replace(/^(.)(..)(.....)(.)$/, '$1-$2-$3-$4')
        const tempFileName = `temp_${fileName}`;
        const tempPath = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/tmp/`;
        const finalPath = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/test/`
        await this.PDFService.generatePDF({
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
                path: await joinPaths(
                    tempPath,
                    tempFileName,
                ),
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
                        padding:0 20px;
                        text-align:right;
                    "><span>${now('DD/MM/YYYY')} REV.</span>
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
        await this.addHeaderToPDF(tempPath, finalPath, orderText);

        // 3. ลบ temp file
        await fs.unlink(tempPath);
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
            for (let i = 1; i < pages.length; i++) {
                const page = pages[i];
                const { width, height } = page.getSize();
                const headerText = `${orderText}`;
                
                // วาด text ที่มุมขวาบน
                page.drawText(headerText, {
                    x: width - 100, // ปรับตำแหน่ง
                    y: height - 20, // ปรับตำแหน่ง (20px จากบน)
                    size: 10,
                    font: font,
                    color: rgb(0, 0, 0),
                });

                // page.drawText();
            }

            // บันทึก PDF
            const pdfBytes = await pdfDoc.save();
            await fs.writeFile(outputPath, pdfBytes);
        } catch (error) {
            throw new Error(`Failed to add header to PDF: ${error.message}`);
        }
    }
}
