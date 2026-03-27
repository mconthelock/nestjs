import * as fs from 'fs/promises';
import * as path from 'path';

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { IdTagRepository } from './idtag.repository';
import {
    PrintedService,
    filesData,
    PdfProcessContext,
} from './printed.service';
import { PrintedImagesService } from './printedImage.service';
import { PrintedCnService } from './printedCn.service';
import { PrintedMergeService } from './printedMerge.service';
import { PrintedTopLabelService } from './printedTopLabel.service';

@Injectable()
export class PrintedQueueService {
    constructor(
        @Inject(forwardRef(() => PrintedService))
        private readonly printed: PrintedService,
        private readonly repo: IdTagRepository,
        private readonly imgs: PrintedImagesService,
        private readonly cns: PrintedCnService,
        private readonly merge: PrintedMergeService,
        private readonly label: PrintedTopLabelService,
    ) {}

    async runPdfProcessJob(body: filesData & PdfProcessContext, jobId: string) {
        return this.printed.runWithPdfContext(
            {
                logFileName: body.logFileName,
                pdfDirectory: body.pdfDirectory,
            },
            async () => {
                const totalStartTime = Date.now();
                this.printed.pdfJobStatusMap.set(jobId, {
                    ...(this.printed.pdfJobStatusMap.get(jobId) || {
                        jobId,
                        queuedAt: new Date().toISOString(),
                    }),
                    status: 'running',
                    message: 'Background processing is running',
                    startedAt: new Date().toISOString(),
                });
                try {
                    await this.printed.writeLog(
                        `[${jobId}] Background processing started`,
                    );
                    await this.printed.writeLog(
                        `Start read source PDF in ${body.inputPath}`,
                    );

                    const outputDirectory = body.pdfDirectory;
                    const readStartTime = Date.now();
                    const pdfBytes = await fs.readFile(body.inputPath);
                    await this.printed.writeLog(
                        `Read source PDF in ${this.printed.formatElapsedTime(readStartTime)}`,
                    );

                    // ขั้นตอนที่ 1: โหลด PDF ด้วย pdf-lib
                    const loadStartTime = Date.now();
                    const pdfDoc = await PDFDocument.load(pdfBytes);
                    const pageCount = pdfDoc.getPageCount();
                    await this.printed.writeLog(
                        `Loaded PDF (${pageCount} pages) in ${this.printed.formatElapsedTime(loadStartTime)}`,
                    );

                    const splitFilesData: {
                        fileName: string;
                        filePath: string;
                        pageNumber: number;
                    }[] = [];

                    // ขั้นตอนที่ 2: แบ่งหน้า, อ่านข้อความ และตั้งชื่อไฟล์
                    await this.merge.splitFiles(
                        pdfDoc,
                        outputDirectory,
                        pageCount,
                        splitFilesData,
                    );

                    // ขั้นตอนที่ 3: บันทึกข้อมูลลง Database
                    const saveStartTime = Date.now();
                    const dbdata: filesData = {
                        ...body,
                        splitFilesData,
                    };
                    const tagdata = await this.printed.saveTagsData(dbdata);
                    const fileID = tagdata.FILES;
                    await this.printed.writeLog(
                        `Saved PDF data in ${this.printed.formatElapsedTime(saveStartTime)}`,
                    );

                    // ขั้นตอนที่ 4: ใส่รูปภาพto PDF
                    await this.imgs.putImages(fileID);

                    // ขั้นตอนที่ 5: ใส่ CN No. ลงใน PDF
                    await this.cns.putCNNo(fileID);

                    // ขั้นตอนที่ 5: ใส่เลขที่ Lot แรกลงใน PDF
                    await this.cns.putFirstLot(dbdata.bmdate);

                    // ขั้นตอนที่ 6: ใส่ Label ด้านบนของ PDF (Japan/Urgent/Eathquake)
                    const labelStartTime = Date.now();
                    await this.label.processLabelDetail(fileID);
                    await this.printed.writeLog(
                        `Put Remark Lable PDF in ${this.printed.formatElapsedTime(labelStartTime)}`,
                    );

                    // ขั้นตอนที่ 7: รวม PDF กลับมาเป็น 1 ไฟล์
                    const outFilePath = path.join(
                        outputDirectory,
                        `${dbdata.filename}`,
                    );
                    const mergeStartTime = Date.now();
                    await this.merge.mergePdfsFast(splitFilesData, outFilePath);
                    await this.printed.writeLog(
                        `Merged PDF in ${this.printed.formatElapsedTime(mergeStartTime)}`,
                    );

                    // ขั้นตอนที่ 8: ลดขนาด PDF ด้วย Ghostscript
                    const compressStartTime = Date.now();
                    const filnalFilePath =
                        await this.merge.compressPdfWithGhostscript(
                            outFilePath,
                        );
                    await this.printed.writeLog(
                        `Compressed PDF in ${this.printed.formatElapsedTime(compressStartTime)}`,
                    );

                    // ขั้นตอนที่ 9: Rename ไฟล์ PDF เป็นชื่อตาม originalfilename
                    const finalPath = path.join(
                        outputDirectory,
                        dbdata.originalfilename,
                    );
                    await fs.rename(filnalFilePath, finalPath);

                    // ขั้นตอนที่ 10: เช็คอนุญาตให้พิมพ์ PDF ได้โดยการอัพเดทสถานะใน Database
                    await this.allowPrint(
                        dbdata.folder,
                        dbdata.originalfilename,
                        fileID,
                        dbdata.pageCount - 1,
                    );

                    await this.printed.writeLog(
                        `Total processing time ${this.printed.formatElapsedTime(totalStartTime)}`,
                    );
                    this.printed.pdfJobStatusMap.set(jobId, {
                        ...(this.printed.pdfJobStatusMap.get(jobId) || {
                            jobId,
                        }),
                        status: 'completed',
                        message: 'Background processing completed',
                        finishedAt: new Date().toISOString(),
                        totalPages: pageCount - 1,
                        fileId: fileID,
                    });
                    await this.printed.writeLog(
                        `[${jobId}] Background processing completed`,
                    );
                    return;
                } catch (error) {
                    try {
                        await fs.unlink(body.inputPath);
                        await this.printed.writeLog(
                            `[${jobId}] Deleted input file after process error: ${body.inputPath}`,
                        );
                    } catch (unlinkError) {
                        await this.printed.writeLog(
                            `[${jobId}] Failed to delete input file after process error`,
                            unlinkError instanceof Error
                                ? unlinkError.message
                                : String(unlinkError),
                        );
                    }
                    this.printed.pdfJobStatusMap.set(jobId, {
                        ...(this.printed.pdfJobStatusMap.get(jobId) || {
                            jobId,
                        }),
                        status: 'failed',
                        message: 'Background processing failed',
                        finishedAt: new Date().toISOString(),
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    });
                    await this.printed.writeLog(
                        `[${jobId}] Background processing failed`,
                        error instanceof Error ? error.message : String(error),
                    );
                    return;
                }
            },
        );
    }

    private async allowPrint(
        folder: string,
        filename: string,
        filesId: number,
        pageCount: number,
    ) {
        // 0 => On process
        // 1 => Hold
        // 2 => Pending Print
        // 3 => Printed
        // 4 => Error
        const data = await this.repo.findAllList({
            filters: [
                {
                    field: 'MST_DIR',
                    op: 'eq',
                    value: `TAG${folder}`,
                },
                {
                    field: 'MST_FILE',
                    op: 'eq',
                    value: filename.replace(/\.pdf$/i, ''),
                },
                { field: 'MST_STATUS', op: 'eq', value: '0' },
            ],
        });
        const status: number = data.length > 0 ? 1 : 2;
        await this.repo.updateFiles({
            FILES: filesId,
            FILE_STATUS: status,
        });
        if (status === 1) {
            this.repo.updatePages(
                Array.from({ length: pageCount }, (_, i) => ({
                    FILES_ID: filesId,
                    PAGE_NUM: i + 1,
                    PAGE_NC: '0',
                })),
            );
        }
        return;
    }
}
