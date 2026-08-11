import * as fs from 'fs/promises';
import * as path from 'path';
import { Injectable, Inject, forwardRef } from '@nestjs/common';

import { IdTagRepository } from './idtag.repository';
import { PrintedService } from './printed.service';
import { PDFDocument, rgb } from 'pdf-lib';
import { writeLineBox, drawGrid } from 'src/common/helpers/file-pdf.helper';

@Injectable()
export class PrintedTopLabelService {
    constructor(
        @Inject(forwardRef(() => PrintedService))
        private readonly printed: PrintedService,
        private readonly repo: IdTagRepository,
    ) {}

    async processLabelDetail(fileID: number) {
        const data = await this.repo.findAllLabel({
            filters: [{ field: 'FILES_ID', op: 'eq', value: fileID }],
        });
        try {
            if (!data.length) return;

            for (const row of data) {
                const pdfContext = await this.printed.setPdfPath({
                    schd_txt: row.SCHDCHAR,
                    schd_p: row.SCHDP,
                    filedir: row.FILE_FOLDER,
                    filename: row.FILE_ONAME,
                });
                const pdfPath = path.join(
                    pdfContext.pdfDirectory,
                    `${row.PAGE_TAG}.pdf`,
                );
                //console.log(pdfPath);
                if (row.URGETNT > 0) {
                    await this.embedUrgentToPdf(pdfPath);
                    await this.printed.writeLog(
                        `Put Label Urgent to ${row.PAGE_TAG}`,
                        null,
                        pdfContext.logFileName,
                    );
                }

                let text = '';
                if (row.JAPAN > 0) {
                    text += 'JAPAN ';
                }

                if (row.EARTHQ > 0) {
                    text += 'MET EARTHQUAKE ';
                }

                if (text === '') {
                    continue;
                }

                // const cdir = await this.printed.getCurrentPdfDirectory();
                // const pdfPath = path.join(cdir, `${row.PAGE_TAG}.pdf`);

                try {
                    await this.embedLabelToPdf(pdfPath, text.trim());
                    await this.printed.writeLog(
                        `Put Label ${text.trim()} to ${row.PAGE_TAG}`,
                        null,
                        pdfContext.logFileName,
                    );
                } catch (error) {
                    await this.printed.writeLog(
                        `Error processing Label for tag ${row.PAGE_TAG}`,
                        error instanceof Error ? error.message : String(error),
                        pdfContext.logFileName,
                    );
                }
            }
        } catch (error) {
            throw new Error(
                `Error processing label detail: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    private async embedLabelToPdf(pdfPath: string, labelData: string) {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [page] = pdfDoc.getPages();
        const opt = {
            pdfpage: page,
            fontsize: 14,
            boxHeight: 15,
            fontColor: rgb(1, 0, 0),
            textOpacity: 0.5,
        };

        await writeLineBox({
            ...opt,
            text: `${labelData}`,
            align: 'right',
            boxX: 260,
            boxY: 10,
            boxWidth: 300,
            // drawBorder: {
            //     color: rgb(0.9, 0.9, 0.9),
            //     width: 0,
            //     bgColor: rgb(1, 0.9, 0.9),
            // },
        });

        await writeLineBox({
            ...opt,
            text: `${labelData}`,
            align: 'right',
            boxX: 260,
            boxY: 810,
            boxWidth: 300,
            // drawBorder: {
            //     color: rgb(0.9, 0.9, 0.9),
            //     width: 0,
            //     bgColor: rgb(0.9, 0.9, 0.9),
            // },
        });
        await fs.writeFile(pdfPath, await pdfDoc.save());
    }

    private async embedUrgentToPdf(pdfPath: string) {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [page] = pdfDoc.getPages();
        //await drawGrid(page);
        const opt = {
            pdfpage: page,
            fontsize: 24,
            boxHeight: 25,
            fontColor: rgb(1, 0, 0),
            textOpacity: 0.5,
        };
        await writeLineBox({
            ...opt,
            text: `URGENT`,
            align: 'center',
            boxX: 400,
            boxY: 225,
            boxWidth: 115,
            drawBorder: {
                color: rgb(1, 0, 0),
                width: 2,
                borderOpacity: 0.5,
                //bgColor: rgb(0.9, 0.9, 0.9),
            },
        });
        await fs.writeFile(pdfPath, await pdfDoc.save());
    }
}
