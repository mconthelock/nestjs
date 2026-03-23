import * as fs from 'fs/promises';
import * as path from 'path';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { PDFDocument } from 'pdf-lib';
// import { PDFParse } from 'pdf-parse';

import { moveFileFromMulter } from 'src/common/utils/files.utils';
import { FileLoggerService } from 'src/common/services/file-logger/file-logger.service';
import { PrintedQueueService } from './PrintedQueue.service';
import { IdTagRepository } from './idtag.repository';
import { SearchIdtagFilesDto } from './dto/search-idtag-file.dto';
import { FiltersDto } from 'src/common/dto/filter.dto';

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
    private pdfProcessQueue: Promise<void> = Promise.resolve();

    constructor(
        private readonly fileLogger: FileLoggerService,
        private readonly repo: IdTagRepository,
        @Inject(forwardRef(() => PrintedQueueService))
        private readonly queue: PrintedQueueService,
    ) {}

    async setPdfPath(data): Promise<PdfProcessContext> {
        const file = data.filename.replace('.pdf', '');
        const pdfDirectory = path.join(
            process.env.IDTAG_FILE_PATH,
            `PRINT/`,
            `${data.schd_txt}${data.schd_p}/`,
            `${data.filedir}/`,
            `${file}/`,
        );
        await fs.mkdir(pdfDirectory, { recursive: true });
        const logFileName = `IDTAG/${data.schd_txt}${data.schd_p}/${data.filedir}/${file}.log`;
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

    runWithPdfContext<T>(
        context: PdfProcessContext,
        callback: () => Promise<T>,
    ): Promise<T> {
        return this.pdfContext.run(context, callback);
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

    async processPdfDocument(
        body: {
            schd_number: string;
            schd_txt: string;
            schd_p: string;
            filedir: string;
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
            const dbData: filesData = {
                bmdate: new Date(body.bmdate),
                folder: body.filedir,
                originalfilename: moved.originalName,
                filename: moved.newName,
                pageCount: pageCount - 1,
                schd_number: body.schd_number,
                schd_txt: body.schd_txt,
                schdp: body.schd_p,
            };
            const tagData = await this.saveTagsData(dbData);

            //Register PDF processing job in memory
            const jobId = `pdf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            this.pdfJobStatusMap.set(jobId, {
                jobId,
                data: tagData,
                status: 'queued',
                message: 'PDF job is queued',
                queuedAt: new Date().toISOString(),
            });

            queuedJobs.push({
                jobId,
                data: tagData,
            });

            //Process PDF in background queue
            this.pdfProcessQueue = this.pdfProcessQueue
                .then(() =>
                    this.queue.runPdfProcessJob(
                        {
                            ...dbData,
                            fileid: tagData.FILES,
                            inputPath: moved.path,
                            pdfDirectory: pdfContext.pdfDirectory,
                            logFileName: pdfContext.logFileName,
                        },
                        jobId,
                    ),
                )
                .catch((error) => {
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
                    this.writeLog(
                        `[${jobId}] Background queue error`,
                        error instanceof Error ? error.message : String(error),
                        pdfContext.logFileName,
                    );
                });
        }
        return {
            status: 'queued',
            total: queuedJobs.length,
            data: queuedJobs,
        };
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
                FILES_PARENT: data.parentFileId,
            },
            splitFilesData
                .filter((tag) => tag.fileName.length > 10)
                .map((fileData) => ({
                    PAGE_NUM: fileData.pageNumber,
                    PAGE_TAG: fileData.fileName,
                    PAGE_STATUS: '0',
                })),
        );
    }

    async getCurrentPdfDirectory() {
        const context = this.pdfContext.getStore();
        if (!context?.pdfDirectory) {
            throw new Error('PDF process context is not initialized');
        }
        return context.pdfDirectory;
    }

    // Other methods for PDF Management
    async findMaster() {
        return this.repo.findAllList();
    }

    async findAllFiles(dto: SearchIdtagFilesDto) {
        return this.repo.findAllFiles(dto);
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
            filedir: fileData[0].FILE_FOLDER,
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
}
