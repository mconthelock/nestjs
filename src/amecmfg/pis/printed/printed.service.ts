import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';

import { PDFParse } from 'pdf-parse';
import { PDFDocument, PageSizes, rgb } from 'pdf-lib';

import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { FileLoggerService } from 'src/common/services/file-logger/file-logger.service';
import { moveFileFromMulter } from 'src/common/utils/files.utils';
import { writeLineBox } from 'src/common/helpers/file-pdf.helper';
import { PisRepository } from './pis.repository';
import { SearchPisFilesDto } from './dto/search-pis-file.dto';

export interface PdfProcessContext {
    logFileName: string;
    pdfDirectory: string;
}

export interface filesData {
    bmdate: Date;
    folder: string;
    originalfilename: string;
    filename: string;
    pageCount: number;
    schd_number: string;
    schd_txt: string;
    schdp: string;
    fileid?: number;
    inputPath?: string;
    parentFileId?: number;
    splitFilesData?: {
        fileName: string;
        filePath: string;
        pageNumber: number;
        mfgno: string;
        packno: string;
    }[];
}

export interface PdfJobStatus {
    jobId: string;
    status: 'queued' | 'running' | 'completed' | 'failed' | 'not_found';
    message: string;
    data?: any;
    queuedAt?: string;
    startedAt?: string;
    finishedAt?: string;
    totalPages?: number;
    fileId?: number;
    error?: string;
}

@Injectable()
export class PrintedService {
    private readonly pdfContext = new AsyncLocalStorage<PdfProcessContext>();
    public readonly pdfJobStatusMap = new Map<string, PdfJobStatus>();
    private readonly maxParallelPdfJobs = this.resolveMaxParallelPdfJobs(
        process.env.IDTAG_PDF_MAX_CONCURRENT_JOBS,
    );
    private activePdfJobs = 0;
    private readonly pendingPdfJobs: Array<() => Promise<void>> = [];

    constructor(
        private readonly fileLogger: FileLoggerService,
        private readonly repo: PisRepository,
    ) {}

    async setPdfPath(data): Promise<PdfProcessContext> {
        const file = data.filename.replace('.pdf', '');
        const pdfDirectory = path.join(
            process.env.IDTAG_FILE_PATH,
            `PRINTPIS/`,
            `${data.schd_txt}${data.schd_p}/`,
            `${file}/`,
        );
        await fs.mkdir(pdfDirectory, { recursive: true });
        const logFileName = `PIS/${data.schd_txt}${data.schd_p}/${data.filedir}/${file}.log`;
        return {
            logFileName,
            pdfDirectory,
        };
    }

    async writeLog(message: string, error?: unknown, logFileName?: string) {
        const context = this.pdfContext.getStore();
        const targetLogFileName = logFileName ?? context?.logFileName;
        if (!targetLogFileName) {
            return;
        }
        await this.fileLogger.log(message, {
            fileName: targetLogFileName,
            error,
        });
    }

    formatElapsedTime(startTime: number) {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const ms = elapsed % 1000;
        if (minutes > 0) return `${minutes} min ${seconds} sec ${ms} ms`;
        if (seconds > 0) return `${seconds} sec ${ms} ms`;
        return `${ms} ms`;
    }

    private resolveMaxParallelPdfJobs(raw?: string): number {
        const fallback = 3;
        if (!raw) {
            return fallback;
        }

        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) {
            return fallback;
        }

        const rounded = Math.floor(parsed);
        return Math.min(5, Math.max(3, rounded));
    }

    private enqueuePdfProcessJob(task: () => Promise<void>): void {
        this.pendingPdfJobs.push(task);
        this.runPendingPdfJobs();
    }

    private runPendingPdfJobs(): void {
        while (
            this.activePdfJobs < this.maxParallelPdfJobs &&
            this.pendingPdfJobs.length > 0
        ) {
            const nextTask = this.pendingPdfJobs.shift();
            if (!nextTask) {
                return;
            }

            this.activePdfJobs += 1;
            void nextTask().finally(() => {
                this.activePdfJobs -= 1;
                this.runPendingPdfJobs();
            });
        }
    }

    runWithPdfContext<T>(
        context: PdfProcessContext,
        callback: () => Promise<T>,
    ): Promise<T> {
        return this.pdfContext.run(context, callback);
    }

    async processPdfDocument(
        body: {
            schd_number: string;
            schd_txt: string;
            schd_p: string;
            bmdate: string;
        },
        files: Express.Multer.File[],
    ) {
        const queuedJobs: {
            jobId: string;
            data?: any;
        }[] = [];

        for (const file of files) {
            const pdfContext = await this.setPdfPath({
                ...body,
                filename: file.originalname,
            });
            const moved = await moveFileFromMulter({
                file,
                destination: pdfContext.pdfDirectory,
            });

            const pdfBytes = await fs.readFile(moved.path);
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pageCount = pdfDoc.getPageCount();
            if (pageCount < 2) continue;

            const dbData: filesData = {
                bmdate: new Date(body.bmdate),
                folder: null,
                originalfilename: moved.originalName,
                filename: moved.newName,
                pageCount: pageCount - 1,
                schd_number: body.schd_number,
                schd_txt: body.schd_txt,
                schdp: body.schd_p,
            };
            const pisFiles = await this.saveTagsData(dbData);
            //Register PDF processing job in memory
            const jobId = `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            this.pdfJobStatusMap.set(jobId, {
                jobId,
                data: pisFiles,
                status: 'queued',
                message: 'PDF job is queued',
                queuedAt: new Date().toISOString(),
            });
            queuedJobs.push({ jobId, data: pisFiles });

            // Process PDF jobs concurrently with a bounded worker pool.
            this.enqueuePdfProcessJob(async () => {
                try {
                    await this.runPdfProcessJob(
                        {
                            ...dbData,
                            fileid: pisFiles.FILES,
                            inputPath: moved.path,
                            pdfDirectory: pdfContext.pdfDirectory,
                            logFileName: pdfContext.logFileName,
                        },
                        jobId,
                    );
                } catch (error) {
                    this.pdfJobStatusMap.set(jobId, {
                        ...(this.pdfJobStatusMap.get(jobId) || {
                            jobId,
                            queuedAt: new Date().toISOString(),
                        }),
                        status: 'failed',
                        message: 'Background queue failed',
                        finishedAt: new Date().toISOString(),
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    });
                    await this.writeLog(
                        `[${jobId}] Background queue error`,
                        error instanceof Error ? error.message : String(error),
                        pdfContext.logFileName,
                    );
                }
            });
        }
        return {
            status: 'queued',
            total: queuedJobs.length,
            data: queuedJobs,
        };
    }

    async runPdfProcessJob(body: filesData & PdfProcessContext, jobId: string) {
        return this.runWithPdfContext(
            {
                logFileName: body.logFileName,
                pdfDirectory: body.pdfDirectory,
            },
            async () => {
                const totalStartTime = Date.now();
                await this.writeLog(`[${jobId}] Background processing started`);
                await this.writeLog(
                    `Start read source PDF in ${body.inputPath}`,
                );

                const outputDirectory = body.pdfDirectory;
                const readStartTime = Date.now();
                const pdfBytes = await fs.readFile(body.inputPath);
                await this.writeLog(
                    `Read source PDF in ${this.formatElapsedTime(readStartTime)}`,
                );

                // ขั้นตอนที่ 1: โหลด PDF ด้วย pdf-lib
                const loadStartTime = Date.now();
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const pageCount = pdfDoc.getPageCount();
                await this.writeLog(
                    `Loaded PDF (${pageCount} pages) in ${this.formatElapsedTime(loadStartTime)}`,
                );

                const splitFilesData: {
                    fileName: string;
                    filePath: string;
                    pageNumber: number;
                    mfgno: string;
                    packno: string;
                }[] = [];

                // ขั้นตอนที่ 2: แบ่งหน้า, อ่านข้อความ และตั้งชื่อไฟล์
                await this.splitFiles(
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
                const fileData = await this.saveTagsData(dbdata);
                const fileID = fileData.FILES;
                await this.writeLog(
                    `Saved PDF data in ${this.formatElapsedTime(saveStartTime)}`,
                );

                // ขั้นตอนที่ 4: ใส่ข้อมูล Label ลงในแต่ละหน้า PDF ตามเงื่อนไข
                await this.processLabelDetail(fileID);

                // ขั้นตอนที่ 5: รวมไฟล์ PDF กลับเป็นไฟล์เดียว
                const outFilePath = path.join(
                    outputDirectory,
                    `${dbdata.filename}`,
                );
                const mergeStartTime = Date.now();
                await this.mergePdfsFast(splitFilesData, outFilePath);
                await this.writeLog(
                    `Merged PDF in ${this.formatElapsedTime(mergeStartTime)}`,
                );

                // ขั้นตอนที่ 6: ลดขนาด PDF ด้วย Ghostscript
                const compressStartTime = Date.now();
                await this.compressPdfWithGhostscript(outFilePath);
                await this.writeLog(
                    `Compressed PDF in ${this.formatElapsedTime(compressStartTime)}`,
                );

                // ขั้นตอนที่ 7: Rename ไฟล์ PDF เป็นชื่อตาม originalfilename
                const finalPath = path.join(
                    outputDirectory,
                    dbdata.originalfilename,
                );
                await fs.rename(outFilePath, finalPath);

                // อัปเดตสถานะงานเป็น 'completed'
                this.repo.updateFiles({
                    FILES: fileID,
                    FILE_STATUS: 2,
                });
                await this.writeLog(
                    `Total processing time ${this.formatElapsedTime(totalStartTime)}`,
                );
                this.pdfJobStatusMap.set(jobId, {
                    ...(this.pdfJobStatusMap.get(jobId) || {
                        jobId,
                    }),
                    status: 'completed',
                    message: 'Background processing completed',
                    finishedAt: new Date().toISOString(),
                    totalPages: pageCount - 1,
                    fileId: fileID,
                });
                await this.writeLog(
                    `[${jobId}] Background processing completed`,
                );
                return;
            },
        );
    }

    async saveTagsData(data: filesData) {
        const splitFilesData = data.splitFilesData || [];
        return this.repo.createPrintedFile(
            {
                FILES: data.fileid,
                SCHDDATE: data.bmdate,
                SCHDNUMBER: data.schd_number,
                SCHDCHAR: data.schd_txt,
                SCHDP: data.schdp,
                FILE_ONAME: data.originalfilename,
                FILE_NAME: data.filename,
                FILE_FOLDER: data.folder,
                FILE_TOTALPAGE: data.pageCount,
                FILE_STATUS: 0,
                FILE_PRINTEDPAGE: 0,
                CREATE_DATE: new Date(),
            },
            splitFilesData
                .filter((tag) => tag.fileName.length > 10)
                .map((fileData) => ({
                    PAGE_NUM: fileData.pageNumber,
                    PAGE_MFGNO: fileData.mfgno,
                    PAGE_PACKING: fileData.packno,
                    PAGE_STATUS: '0',
                })),
        );
    }

    async splitFiles(
        pdfDoc: PDFDocument,
        outputDirectory: string,
        pageCount: number,
        splitFilesData: {
            fileName: string;
            filePath: string;
            pageNumber: number;
            mfgno: string;
            packno: string;
        }[],
    ) {
        const splitStartTime = Date.now();
        const [a4Width, a4Height] = PageSizes.A4;
        for (let i = 1; i < pageCount; i++) {
            const singlePageDoc = await PDFDocument.create();
            const sourcePage = pdfDoc.getPage(i);
            const [embeddedPage] = await singlePageDoc.embedPages([sourcePage]);
            const page = singlePageDoc.addPage([a4Width, a4Height]);
            const scale = Math.min(
                a4Width / embeddedPage.width,
                a4Height / embeddedPage.height,
            );
            const targetWidth = embeddedPage.width * scale;
            const targetHeight = embeddedPage.height * scale;

            page.drawPage(embeddedPage, {
                x: (a4Width - targetWidth) / 2,
                y: (a4Height - targetHeight) / 2,
                width: targetWidth,
                height: targetHeight,
            });
            const singlePageBytes = await singlePageDoc.save();
            const parser = new PDFParse({
                data: Buffer.from(singlePageBytes),
            });
            let parsedData;
            try {
                parsedData = await parser.getText();
                const textContent = parsedData.text;
                const pisData = textContent.split('\n');
                const pageorder = pisData[3];
                const pageorderData = pageorder.replaceAll(' ', '');
                const mfgno = pageorderData.substring(0, 11).replace(/-/g, '');
                const packno = pageorderData
                    .substring(11, 17)
                    .replace(/-/g, '');

                const newFileName = `${mfgno}-${packno}.pdf`;
                const outputPath = path.join(outputDirectory, newFileName);
                await fs.writeFile(outputPath, singlePageBytes);
                splitFilesData.push({
                    fileName: newFileName,
                    filePath: outputPath,
                    pageNumber: i,
                    mfgno,
                    packno,
                });
            } finally {
                await parser.destroy();
            }
        }
        await this.writeLog(
            `Split ${splitFilesData.length} pages in ${this.formatElapsedTime(splitStartTime)}`,
        );
        return splitFilesData;
    }

    async processLabelDetail(fileID: number) {
        const data = await this.repo.findAllLabel({
            filters: [{ field: 'FILES_ID', op: 'eq', value: fileID }],
        });
        try {
            if (!data.length) return;

            for (const row of data) {
                let text = '';
                if (row.JAPAN > 0) {
                    text += 'JAPAN ';
                }

                if (row.URGETNT > 0) {
                    text += 'URGENT ';
                }

                if (row.EARTHQ > 0) {
                    text += 'MET EARTHQUAKE ';
                }
                if (text === '') {
                    continue;
                }

                const pdfContext = await this.setPdfPath({
                    schd_txt: row.SCHDCHAR,
                    schd_p: row.SCHDP,
                    filedir: row.FILE_FOLDER,
                    filename: row.FILE_ONAME,
                });

                const pdfPath = path.join(
                    pdfContext.pdfDirectory,
                    `${row.PAGE_MFGNO}-${row.PAGE_PACKING}.pdf`,
                );
                try {
                    await this.embedLabelToPdf(pdfPath, text.trim());
                    await this.writeLog(
                        `Put Label to ${row.PAGE_MFGNO}-${row.PAGE_PACKING}`,
                    );
                } catch (error) {
                    await this.writeLog(
                        `Error processing Label for tag ${row.PAGE_MFGNO}-${row.PAGE_PACKING}`,
                        error instanceof Error ? error.message : String(error),
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
            fontsize: 12,
            boxHeight: 15,
            fontColor: rgb(1, 0, 0),
        };

        await writeLineBox({
            ...opt,
            text: `${labelData}`,
            align: 'right',
            boxX: 275,
            boxY: 3,
            boxWidth: 300,
            // drawBorder: {
            //     color: rgb(1, 0, 0),
            //     width: 0.5,
            //     bgColor: rgb(1, 1, 1),
            // },
        });

        await writeLineBox({
            ...opt,
            text: `${labelData}`,
            align: 'right',
            boxX: 275,
            boxY: 810,
            boxWidth: 300,
        });
        await fs.writeFile(pdfPath, await pdfDoc.save());
    }

    async mergePdfsFast(filesData: { filePath: string }[], outputPath: string) {
        const mergedPdf = await PDFDocument.create();
        const BATCH_SIZE = 100;
        for (let i = 0; i < filesData.length; i += BATCH_SIZE) {
            const batchStartTime = Date.now();
            const batch = filesData.slice(i, i + BATCH_SIZE);
            const buffers = await Promise.all(
                batch.map((file) => fs.readFile(file.filePath)),
            );
            for (const buffer of buffers) {
                const tempDoc = await PDFDocument.load(buffer);
                const [copiedPage] = await mergedPdf.copyPages(tempDoc, [0]);
                mergedPdf.addPage(copiedPage);
            }
        }

        const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
        await fs.writeFile(outputPath, mergedPdfBytes);
    }

    async compressPdfWithGhostscript(inputPath: string) {
        const command =
            '\\\\amecnas\\AMECWEB\\wwwroot\\production\\cdn\\Application\\gs\\gs10.00.0\\bin\\gswin32c.exe';
        const parsedPath = path.parse(inputPath);
        // `${parsedPath.name}.compressed${parsedPath.ext}`,
        const compressedPath = path.join(parsedPath.dir, `output.pdf`);
        await new Promise<void>((resolve, reject) => {
            const stderrChunks: Buffer[] = [];
            const child = spawn(command, [
                ...[],
                '-sDEVICE=pdfwrite',
                '-dCompatibilityLevel=1.7',
                '-dNOPAUSE',
                '-dQUIET',
                '-dBATCH',
                `-dPDFSETTINGS=/ebook`,
                `-sOutputFile=${compressedPath}`,
                inputPath,
            ]);

            child.stderr.on('data', (chunk) => stderrChunks.push(chunk));
            child.on('error', (error) => reject(error));
            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                    return;
                }

                reject(
                    new Error(
                        `Ghostscript exited with code ${code}: ${Buffer.concat(stderrChunks).toString().trim()}`,
                    ),
                );
            });
        });
    }

    async downloadFile(id: number) {
        const fileData = await this.repo.findAllFiles({ FILES: id });
        if (!fileData) {
            throw new Error('File not found');
        }

        const pdfContext = await this.setPdfPath({
            schd_number: fileData[0].SCHDNUMBER,
            schd_txt: fileData[0].SCHDCHAR,
            schd_p: fileData[0].SCHDP,
            filename: fileData[0].FILE_ONAME,
        });
        try {
            return {
                filePath: pdfContext.pdfDirectory,
                fileName: fileData[0].FILE_ONAME,
            };
        } catch {
            throw new Error('File not found');
        }
    }

    async findAllFiles(dto: SearchPisFilesDto) {
        return this.repo.findAllFiles(dto);
    }

    async updatePrint(filesId: number, status: number) {
        try {
            const file = await this.repo.findAllFiles({ FILES: filesId });
            this.repo.updatePages(
                Array.from({ length: file[0].FILE_TOTALPAGE }, (_, i) => ({
                    FILES_ID: filesId,
                    PAGE_NUM: i + 1,
                    PAGE_STATUS: status.toString(),
                })),
            );
            return this.repo.updateFiles({
                FILES: filesId,
                FILE_STATUS: status,
                PRINTED_DATE: status === 3 ? new Date() : null,
            });
        } catch (error) {
            throw new Error(
                `Error updating print file status for FILES_ID ${filesId}`,
            );
        }
    }

    async deletePdf(filesId: number) {
        const fileData = await this.repo.findAllFiles({ FILES: filesId });
        const pdfContext = await this.setPdfPath({
            schd_number: fileData[0].SCHDNUMBER,
            schd_txt: fileData[0].SCHDCHAR,
            schd_p: fileData[0].SCHDP,
            filename: fileData[0].FILE_ONAME,
        });
        try {
            await fs.rm(pdfContext.pdfDirectory, {
                recursive: true,
                force: true,
            });
            return this.repo.deleteFiles(filesId);
        } catch (error) {
            throw new Error(
                `Error deleting PDF directory for FILES_ID ${filesId}`,
            );
        }
    }
}
