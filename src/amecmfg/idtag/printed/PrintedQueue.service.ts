import * as fs from 'fs/promises';
import * as path from 'path';

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { IdTagRepository } from './idtag.repository';
import {
    OrderInfo,
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

    private async markPdfJobFailed(fileId?: number) {
        if (!fileId) {
            return;
        }

        await this.repo.updateFiles({
            FILES: fileId,
            FILE_STATUS: 4,
            PRINTED_DATE: null,
            FILE_PRINTEDPAGE: 0,
        });
    }

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
                        item: string;
                        packing: string;
                        process: string;
                        drawing: string;
                        fileMfgNo: OrderInfo[] | null;
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
                    await this.printed.writeLog(
                        `[${jobId}] Step 7/9: starting merge to ${outFilePath}`,
                    );
                    await this.printed.writeLog(
                        `[${jobId}] Step 7/9: merge input fragments=${splitFilesData.length}, outputDir=${outputDirectory}`,
                    );
                    try {
                        for (const file of splitFilesData) {
                            const stat = await fs
                                .stat(file.filePath)
                                .catch(() => null);
                            await this.printed.writeLog(
                                `[${jobId}] Step 7/9: fragment check path=${file.filePath}, exists=${Boolean(stat)}, size=${stat?.size ?? 0}`,
                            );
                        }
                        await this.merge.mergePdfsFast(
                            splitFilesData,
                            outFilePath,
                        );
                        const mergedStat = await fs
                            .stat(outFilePath)
                            .catch(() => null);
                        await this.printed.writeLog(
                            `[${jobId}] Step 7/9: merged PDF successfully in ${this.printed.formatElapsedTime(mergeStartTime)} -> ${outFilePath}, exists=${Boolean(mergedStat)}, size=${mergedStat?.size ?? 0}`,
                        );
                    } catch (error) {
                        const message =
                            error instanceof Error
                                ? error.message
                                : String(error);
                        await this.printed.writeLog(
                            `[${jobId}] Step 7/9 failed during merge: ${outFilePath}`,
                            message,
                        );
                        try {
                            const dirStat = await fs.stat(outputDirectory);
                            await this.printed.writeLog(
                                `[${jobId}] Step 7/9: output dir exists=${true}, writable=${dirStat.isDirectory()}`,
                            );
                        } catch (dirError) {
                            await this.printed.writeLog(
                                `[${jobId}] Step 7/9: output dir access failed for ${outputDirectory}`,
                                dirError instanceof Error
                                    ? dirError.message
                                    : String(dirError),
                            );
                        }
                        throw new Error(
                            `Merge failed for ${outFilePath}: ${message}`,
                        );
                    }

                    // ขั้นตอนที่ 8: ลดขนาด PDF ด้วย Ghostscript
                    const compressStartTime = Date.now();
                    await this.printed.writeLog(
                        `[${jobId}] Step 8/9: starting Ghostscript compression for ${outFilePath}`,
                    );
                    try {
                        const inputStat = await fs.stat(outFilePath);
                        await this.printed.writeLog(
                            `[${jobId}] Step 8/9: source file before compression exists=${true}, size=${inputStat.size} bytes, path=${outFilePath}`,
                        );
                    } catch (error) {
                        await this.printed.writeLog(
                            `[${jobId}] Step 8/9: source file before compression not readable: ${outFilePath}`,
                            error instanceof Error
                                ? error.message
                                : String(error),
                        );
                        throw error;
                    }
                    let filnalFilePath: string;
                    try {
                        filnalFilePath =
                            await this.merge.compressPdfWithGhostscript(
                                outFilePath,
                            );
                        await this.printed.writeLog(
                            `[${jobId}] Step 8/9: compressed PDF successfully in ${this.printed.formatElapsedTime(compressStartTime)} -> ${filnalFilePath}`,
                        );
                    } catch (error) {
                        const message =
                            error instanceof Error
                                ? error.message
                                : String(error);
                        await this.printed.writeLog(
                            `[${jobId}] Step 8/9 failed during Ghostscript compression: input=${outFilePath}`,
                            message,
                        );
                        try {
                            const dirCheck = await fs
                                .access(
                                    outputDirectory,
                                    fs.constants.W_OK | fs.constants.X_OK,
                                )
                                .then(() => 'OK')
                                .catch(
                                    (dirError) =>
                                        `DENIED: ${dirError instanceof Error ? dirError.message : String(dirError)}`,
                                );
                            await this.printed.writeLog(
                                `[${jobId}] Step 8/9: output dir permission check=${dirCheck}, dir=${outputDirectory}`,
                            );
                        } catch (dirCheckError) {
                            await this.printed.writeLog(
                                `[${jobId}] Step 8/9: permission check raised exception for ${outputDirectory}`,
                                dirCheckError instanceof Error
                                    ? dirCheckError.message
                                    : String(dirCheckError),
                            );
                        }
                        throw new Error(
                            `Ghostscript compression failed for ${outFilePath}: ${message}`,
                        );
                    }

                    // ขั้นตอนที่ 9: Rename ไฟล์ PDF เป็นชื่อตาม originalfilename
                    const finalPath = path.join(
                        outputDirectory,
                        dbdata.originalfilename,
                    );
                    try {
                        const sourceStat = await fs.stat(filnalFilePath);
                        await this.printed.writeLog(
                            `[${jobId}] Step 9/9: source before rename exists=${true}, size=${sourceStat.size} bytes, path=${filnalFilePath}`,
                        );
                    } catch (error) {
                        await this.printed.writeLog(
                            `[${jobId}] Step 9/9: source before rename missing or unreadable: ${filnalFilePath}`,
                            error instanceof Error
                                ? error.message
                                : String(error),
                        );
                        throw error;
                    }
                    try {
                        await fs.access(
                            outputDirectory,
                            fs.constants.W_OK | fs.constants.X_OK,
                        );
                        await this.printed.writeLog(
                            `[${jobId}] Step 9/9: target directory writable: ${outputDirectory}`,
                        );
                    } catch (error) {
                        const message =
                            error instanceof Error
                                ? error.message
                                : String(error);
                        await this.printed.writeLog(
                            `[${jobId}] Step 9/9: target directory permission denied: ${outputDirectory}`,
                            message,
                        );
                        throw new Error(
                            `Rename target directory not writable: ${outputDirectory} (${message})`,
                        );
                    }
                    await this.printed.writeLog(
                        `[${jobId}] Step 9/9: renaming ${filnalFilePath} -> ${finalPath}`,
                    );
                    try {
                        await fs.rename(filnalFilePath, finalPath);
                        await this.printed.writeLog(
                            `[${jobId}] Step 9/9: rename completed successfully -> ${finalPath}`,
                        );
                    } catch (error) {
                        const message =
                            error instanceof Error
                                ? error.message
                                : String(error);
                        await this.printed.writeLog(
                            `[${jobId}] Step 9/9 failed during rename: from=${filnalFilePath} to=${finalPath}`,
                            message,
                        );
                        try {
                            const finalExist = await fs
                                .stat(finalPath)
                                .then(() => true)
                                .catch(() => false);
                            const sourceExist = await fs
                                .stat(filnalFilePath)
                                .then(() => true)
                                .catch(() => false);
                            await this.printed.writeLog(
                                `[${jobId}] Step 9/9: rename pre-check finalExists=${finalExist}, sourceExists=${sourceExist}, dir=${outputDirectory}`,
                            );
                        } catch (checkError) {
                            await this.printed.writeLog(
                                `[${jobId}] Step 9/9: rename pre-check failed`,
                                checkError instanceof Error
                                    ? checkError.message
                                    : String(checkError),
                            );
                        }
                        throw new Error(
                            `Rename failed from ${filnalFilePath} to ${finalPath}: ${message}`,
                        );
                    }

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
                    await this.markPdfJobFailed(body.fileid);
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
            FILE_STATUS: 2, // Manual update เป็น 2 ก่อน รอ PP พร้อมใส่ข้อมูล NC
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
