import * as fs from 'fs/promises';
import path from 'path';
import { Injectable } from '@nestjs/common';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { now } from 'src/common/utils/dayjs.utils';
import { joinPaths } from 'src/common/utils/files.utils';
import { generatePDFParams } from '../packing-list-issue.interface';
import { PDFService } from 'src/common/services/pdf/pdf.service';

@Injectable()
export class GenPdfService {
    constructor(private readonly PDFService: PDFService) {}
    
    private readonly tempDir = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/tmp/`;

    async generatePDF({
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
