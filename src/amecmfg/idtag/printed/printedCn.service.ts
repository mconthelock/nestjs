import * as fs from 'fs/promises';
import * as path from 'path';
import * as dayjsModule from 'dayjs';
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);
import { rgb, PDFDocument } from 'pdf-lib';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { writeLineBox } from 'src/common/helpers/file-pdf.helper';
import { IdTagRepository } from './idtag.repository';
import { PrintedService } from './printed.service';
import { R027mp1Service } from 'src/as400/rtnlibf/r027mp1/r027mp1.service';

@Injectable()
export class PrintedCnService {
    constructor(
        @Inject(forwardRef(() => PrintedService))
        private readonly printed: PrintedService,
        private readonly repo: IdTagRepository,
        private r027: R027mp1Service,
    ) {}

    private async resolvePdfRuntimeContext(filesId: number) {
        try {
            const pdfDirectory = await this.printed.getCurrentPdfDirectory();
            return {
                pdfDirectory,
                logFileName: undefined as string | undefined,
            };
        } catch {
            const fileData = await this.repo.findAllFiles({ FILES: filesId });
            if (!fileData || fileData.length === 0) {
                throw new Error(`File not found for FILES_ID ${filesId}`);
            }

            const context = await this.printed.setPdfPath({
                schd_number: fileData[0].SCHDNUMBER,
                schd_txt: fileData[0].SCHDCHAR,
                schd_p: fileData[0].SCHDP,
                filedir: fileData[0].FILE_FOLDER,
                filename:
                    fileData[0].FILES_PARENT != null
                        ? fileData[0].FILE_NAME
                        : fileData[0].FILE_ONAME,
            });
            return context;
        }
    }

    async putCNNo(filesId: number) {
        const cnStartTime = Date.now();
        const runtimeContext = await this.resolvePdfRuntimeContext(filesId);
        const cnData = await this.repo.findAllCn({
            filters: [
                { field: 'FILES_ID', op: 'eq', value: filesId },
                { field: 'PAGE_CN', op: 'isNull' },
            ],
        });

        if (cnData.length === 0) {
            await this.printed.writeLog(
                `No CN data to put in PDF for FILES_ID ${filesId}`,
                undefined,
                runtimeContext.logFileName,
            );
            return;
        }

        for (const data of cnData) {
            // console.log(pdfPath);
            try {
                const pdfPath = path.join(
                    runtimeContext.pdfDirectory,
                    `${data.PAGE_TAG}.pdf`,
                );
                if (data.DOCNO != null) {
                    await this.embedCNToPdf(pdfPath, {
                        cnno: data.DOCNO,
                        sendto: data.SENTTO,
                        senddate: data.PRDCTNAME,
                    });
                    await this.printed.writeLog(
                        `Put CN No. ${data.DOCNO} to ${data.PAGE_TAG}`,
                        undefined,
                        runtimeContext.logFileName,
                    );
                }
            } catch (error) {
                await this.printed.writeLog(
                    `Error processing CN Data for tag ${data.PAGE_TAG}`,
                    error instanceof Error ? error.message : String(error),
                    runtimeContext.logFileName,
                );
            }
        }

        await this.printed.writeLog(
            `Put CN No. in complete PDF in ${this.printed.formatElapsedTime(cnStartTime)}`,
            undefined,
            runtimeContext.logFileName,
        );
    }

    async putFirstLot(bmdate: Date | string) {
        const firstStartTime = Date.now();
        const bmdateStr = dayjs(bmdate).format('YYYYMMDD');
        let firstData: any[] = [];
        try {
            firstData = await this.r027.findAll({
                filters: [
                    { field: 'R27M13', op: 'eq', value: bmdateStr },
                    { field: 'R27M09', op: 'ne', value: '' },
                ],
            });
        } catch (error) {
            await this.printed.writeLog(
                `Skip First Lot lookup due to query error for BMDate ${bmdateStr}`,
                error instanceof Error ? error.message : String(error),
            );
            return;
        }

        let lotCount = 0;
        for (const data of firstData) {
            let pdfDirectory = '';
            try {
                pdfDirectory = await this.printed.getCurrentPdfDirectory();
            } catch {
                await this.printed.writeLog(
                    `Skip First Lot update for ${data.R27M11} because PDF runtime context is not initialized for BMDate ${bmdateStr}`,
                );
                continue;
            }

            const pdfPath = path.join(pdfDirectory, `${data.R27M11}.pdf`);
            try {
                await this.embedFirstToPdf(pdfPath, data.R27M09);
                await this.printed.writeLog(
                    `Put First Lot. No. ${data.R27M09} to ${data.R27M11}`,
                );
                lotCount++;
            } catch (error) {
                continue;
            }
        }

        if (lotCount === 0) {
            await this.printed.writeLog(
                `No First Lot No. data to put in PDF for BMDate ${bmdateStr}`,
            );
            return;
        }
        await this.printed.writeLog(
            `Put first Lot No. in complete PDF in ${this.printed.formatElapsedTime(firstStartTime)}`,
        );
    }

    private async embedCNToPdf(pdfPath: string, text: any) {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [page] = pdfDoc.getPages();
        const opt = {
            pdfpage: page,
            fontsize: 14,
            boxHeight: 15,
        };
        await writeLineBox({
            ...opt,
            text: `${text.cnno == null ? '' : text.cnno}`,
            align: 'center',
            boxX: 345,
            boxY: 164,
            boxWidth: 129,
            drawBorder: {
                color: rgb(0.9, 0.9, 0.9),
                width: 0,
                //bgColor: rgb(0.9, 0.9, 0.9),
            },
        });

        if (text.sendto) {
            await writeLineBox({
                ...opt,
                text: `PLEASE SEND TO ${text.sendto} ${text.senddate == null ? '' : `ON ${dayjs(text.senddate).format('DD/MM/YYYY')}`}`,
                align: 'left',
                fontsize: 12,
                boxX: 15,
                boxY: 790,
                boxWidth: 300,
                drawBorder: {
                    color: rgb(1, 1, 1),
                    width: 0,
                    bgColor: rgb(1, 1, 1),
                },
            });
        }
        await fs.writeFile(pdfPath, await pdfDoc.save());
    }

    private async embedFirstToPdf(pdfPath: string, text: string) {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [page] = pdfDoc.getPages();
        await writeLineBox({
            pdfpage: page,
            fontsize: 12,
            boxHeight: 15,
            boxWidth: 170,
            text: `${text == null ? '' : text}`,
            align: 'left',
            boxX: 15,
            boxY: 810,
        });

        await fs.writeFile(pdfPath, await pdfDoc.save());
    }
}
