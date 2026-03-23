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

    async findFilesLog(id: number) {
        const fileData = await this.repo.findAllFiles({ FILES: id });
        const pdfContext = await this.setPdfPath({
            schd_number: fileData[0].SCHDNUMBER,
            schd_txt: fileData[0].SCHDCHAR,
            schd_p: fileData[0].SCHDP,
            filedir: fileData[0].FILE_FOLDER,
            filename: fileData[0].FILE_ONAME,
        });
        try {
            return await this.fileLogger.readLog({
                fileName: pdfContext.logFileName,
            });
        } catch {
            throw new Error('Log file not found');
        }
    }

    async deletePdf(filesId: number) {
        const fileData = await this.repo.findAllFiles({ FILES: filesId });
        const pdfContext = await this.setPdfPath({
            schd_number: fileData[0].SCHDNUMBER,
            schd_txt: fileData[0].SCHDCHAR,
            schd_p: fileData[0].SCHDP,
            filedir: fileData[0].FILE_FOLDER,
            filename: fileData[0].FILE_ONAME,
        });
        try {
            await fs.rm(pdfContext.pdfDirectory, {
                recursive: true,
                force: true,
            });
            return this.repo.deletePdf(filesId);
        } catch (error) {
            throw new Error(
                `Error deleting PDF directory for FILES_ID ${filesId}`,
            );
        }
    }

    async updatePrintFileStatus(filesId: number, status: number, page: number) {
        const file = await this.repo.updatePrintFileStatus(filesId, status);
        const pages = await this.repo.updatePrintPagesStatus(filesId, status);
        return { file, pages };
    }

    //Job scheduling for NC Detail
    // async notifyNcDetail() {
    //     const templatePath = path.join(
    //         process.env.IDTAG_FILE_PATH,
    //         `templates/NC Detail Template.xlsx`,
    //     );
    //     const exportFileName = `NC Detail ${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
    //     const data = await this.repo.findNcDetail({
    //         filters: [{ field: 'TASKNAME', op: 'isNull' }],
    //     });

    //     try {
    //         const attachment = await exportExcel({
    //             templatePath,
    //             filename: exportFileName,
    //             data,
    //         });
    //         await this.mail.sendMail({
    //             to: 'chalorms@MitsubishiElevatorAsia.co.th',
    //             subject: `NC Detail Report - ${dayjs().format('YYYY-MM-DD')}`,
    //             html: '',
    //             attachments: [
    //                 {
    //                     filename: exportFileName,
    //                     content: attachment,
    //                 },
    //             ],
    //         });
    //     } catch (error) {
    //         throw new Error(
    //             `Error generating NC Detail Excel: ${error instanceof Error ? error.message : String(error)}`,
    //         );
    //     }
    // }

    // async processNcDetail() {
    //     const data = await this.repo.findNcDetail({
    //         filters: [
    //             { field: 'TASKNAME', op: 'isNotNull' },
    //             { field: 'PAGE_NC', op: 'eq', value: '0' },
    //         ],
    //     });
    //     try {
    //         if (!data.length) return;
    //         const grouped = new Map<number, any[]>();
    //         for (const row of data) {
    //             const group = grouped.get(row.FILES_ID) || [];
    //             group.push(row);
    //             grouped.set(row.FILES_ID, group);
    //         }

    //         for (const [filesId, item] of grouped) {
    //             const dbData: filesData = {
    //                 bmdate: item[0].SCHDDATE,
    //                 folder: item[0].FILE_FOLDER,
    //                 originalfilename: `${item[0].FILE_ONAME.replace(/\.pdf$/i, '')}(${item[0].TASKNAME}).pdf`,
    //                 filename: `${Date.now()}.pdf`,
    //                 pageCount: item.length,
    //                 schd_number: item[0].SCHDNUMBER,
    //                 schd_txt: item[0].SCHDCHAR,
    //                 schdp: item[0].SCHDP,
    //                 parentFileId: filesId,
    //             };
    //             const tagData = await this.saveTagsData(dbData);
    //             console.log(tagData);
    //         }

    //         // const results: {
    //         //     filesId: number;
    //         //     taskName: string;
    //         //     pages: number;
    //         //     outputPath?: string;
    //         //     status: 'processed' | 'skipped' | 'failed';
    //         //     reason?: string;
    //         // }[] = [];

    //         // for (const [filesId, groupRows] of grouped.entries()) {
    //         //     const firstRow = groupRows[0];
    //         //     const fileName =
    //         //         firstRow?.FILE_ONAME ||
    //         //         firstRow?.FILE_NAME ||
    //         //         `${filesId}.pdf`;

    //         //     try {
    //         //         const pdfContext = await this.setPdfPath({
    //         //             schd_number: firstRow.SCHDNUMBER,
    //         //             schd_txt: firstRow.SCHDCHAR,
    //         //             schd_p: firstRow.SCHDP,
    //         //             filedir: firstRow.FILE_FOLDER,
    //         //             filename: fileName,
    //         //         });

    //         //         const taskName = String(firstRow.TASKNAME || 'NC_DETAIL')
    //         //             .trim()
    //         //             .replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
    //         //         const outputDirectory = path.join(
    //         //             pdfContext.pdfDirectory,
    //         //             'NC_DETAIL',
    //         //         );
    //         //         await fs.mkdir(outputDirectory, { recursive: true });

    //         //         const outputFileName = `${taskName}_${filesId}_${dayjs().format('YYYYMMDD_HHmmss')}.pdf`;
    //         //         const outputPath = path.join(
    //         //             outputDirectory,
    //         //             outputFileName,
    //         //         );

    //         //         const sourcePages: { filePath: string }[] = [];
    //         //         const pageNums: number[] = [];

    //         //         for (const row of groupRows) {
    //         //             const pagePath = path.join(
    //         //                 pdfContext.pdfDirectory,
    //         //                 `${row.PAGE_TAG}.pdf`,
    //         //             );
    //         //             const exists = await fs
    //         //                 .access(pagePath)
    //         //                 .then(() => true)
    //         //                 .catch(() => false);

    //         //             if (!exists) {
    //         //                 await this.writeLog(
    //         //                     `[NC_DETAIL][${filesId}] Missing page file: ${pagePath}`,
    //         //                     undefined,
    //         //                     pdfContext.logFileName,
    //         //                 );
    //         //                 continue;
    //         //             }

    //         //             sourcePages.push({ filePath: pagePath });
    //         //             pageNums.push(Number(row.PAGE_NUM));
    //         //         }

    //         //         if (!sourcePages.length) {
    //         //             results.push({
    //         //                 filesId,
    //         //                 taskName,
    //         //                 pages: 0,
    //         //                 status: 'skipped',
    //         //                 reason: 'No source pages found',
    //         //             });
    //         //             continue;
    //         //         }

    //         //         await this.mergePdfsFast(sourcePages, outputPath);
    //         //         await this.repo.updateNcPagesStatusByPageNums(
    //         //             filesId,
    //         //             pageNums,
    //         //             '1',
    //         //         );

    //         //         await this.writeLog(
    //         //             `[NC_DETAIL][${filesId}] Created ${outputPath} (${sourcePages.length} pages)`,
    //         //             undefined,
    //         //             pdfContext.logFileName,
    //         //         );

    //         //         results.push({
    //         //             filesId,
    //         //             taskName,
    //         //             pages: sourcePages.length,
    //         //             outputPath,
    //         //             status: 'processed',
    //         //         });
    //         //     } catch (groupError) {
    //         //         results.push({
    //         //             filesId,
    //         //             taskName: String(firstRow?.TASKNAME || 'NC_DETAIL'),
    //         //             pages: groupRows.length,
    //         //             status: 'failed',
    //         //             reason:
    //         //                 groupError instanceof Error
    //         //                     ? groupError.message
    //         //                     : String(groupError),
    //         //         });
    //         //     }
    //         // }

    //         // return {
    //         //     status: 'completed',
    //         //     totalGroups: grouped.size,
    //         //     processedGroups: results.filter((x) => x.status === 'processed')
    //         //         .length,
    //         //     skippedGroups: results.filter((x) => x.status === 'skipped')
    //         //         .length,
    //         //     failedGroups: results.filter((x) => x.status === 'failed')
    //         //         .length,
    //         //     results,
    //         // };
    //     } catch (error) {
    //         throw new Error(
    //             `Error processing NC Detail: ${error instanceof Error ? error.message : String(error)}`,
    //         );
    //     }
    // }
}
