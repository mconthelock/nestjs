import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import * as dayjs from 'dayjs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';
import { AsyncLocalStorage } from 'async_hooks';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { PDFParse } from 'pdf-parse';
import { compressDimension } from 'src/common/helpers/resize-image.helper';
import { writeLineBox } from 'src/common/helpers/file-pdf.helper';
import { FileLoggerService } from 'src/common/services/file-logger/file-logger.service';
import { moveFileFromMulter } from 'src/common/utils/files.utils';
import { R027mp1Service } from 'src/as400/rtnlibf/r027mp1/r027mp1.service';

import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';

import { IdTagRepository } from './idtag.repository';
import { SearchIdtagFilesDto } from './dto/search-idtag-file.dto';

interface filesData {
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

interface PdfProcessContext {
    logFileName: string;
    pdfDirectory: string;
}

@Injectable()
export class IdtagService {
    private pdfProcessQueue: Promise<void> = Promise.resolve();
    private readonly pdfJobStatusMap = new Map<string, PdfJobStatus>();
    private readonly pdfProcessContext =
        new AsyncLocalStorage<PdfProcessContext>();

    constructor(
        @InjectRepository(M008KP, 'amecConnection')
        private readonly m08: Repository<M008KP>,
        @InjectRepository(F110KP, 'amecConnection')
        private readonly f11: Repository<F110KP>,
        @InjectRepository(F001KP, 'amecConnection')
        private readonly f01: Repository<F001KP>,

        private readonly repo: IdTagRepository,
        private readonly fileLogger: FileLoggerService,
        private r027: R027mp1Service,
    ) {}

    async findBySchd(schd: string, schdp?: string) {
        const where: any = {};
        if (schd) where.M8K01 = schd;
        if (schdp) where.M8K02 = schdp;
        return this.m08.find({
            where: { ...where },
            relations: {
                bmdate: true,
                tags: { process: true, orders: true, detail: true },
            },
        });
    }

    // async findBySchd(schd: string, schdp?: string, item?: string) {
    //   const qb = this.m08
    //     .createQueryBuilder('m')
    //     .leftJoinAndSelect('m.bmdate', 'b')
    //     .leftJoinAndSelect('m.tags', 't')
    //     .leftJoinAndSelect('t.process', 'p')
    //     .leftJoinAndSelect('t.orders', 'o')
    //     .leftJoinAndSelect('t.detail', 'd');

    //   if (schd) {
    //     qb.andWhere('m.M8K01 = :schd', { schd });
    //   }

    //   if (schdp) {
    //     qb.andWhere('m.M8K02 = :schdp', { schdp });
    //   }

    //   if (item) {
    //     qb.andWhere('TRIM(t.F01R03) = :item', { item: item.trim() });
    //   }

    //   return qb.getMany();
    // }

    async findf110kpBySchd(schd: string, p?: string) {
        const where: any = {};
        // if (schd) where.tags = {F01R02: schd};
        if (schd) where.F11K05 = schd;
        if (p) where.F11K06 = p;
        return this.f11.find({
            where: { ...where },
            relations: {
                tags: { process: true },
            },
        });
    }

    async findDetailByTag(tag: string) {
        return this.f11.find({
            where: { F11K01: tag },
        });
    }

    async findByBMDate(date: string) {
        return this.m08.find({
            where: { bmdate: { Q9PP: date } },
            relations: {
                bmdate: true,
                tags: { process: true, orders: true, detail: true },
            },
        });
    }

    async findAll() {
        return this.m08.find({
            relations: {
                bmdate: true,
                tags: { process: true, detail: true },
            },
        });
    }

    async getWeekList() {
        return this.f01
            .createQueryBuilder('f1')
            .select('f1.F01R02', 'F01R02')
            .innerJoin('f1.process', 'f2')
            .where('f2.F02R07 = :status', { status: 0 })
            .andWhere('f1.F01R02 > :week', { week: '2024080' })
            .groupBy('f1.F01R02')
            .orderBy('f1.F01R02', 'DESC')
            .getRawMany();
    }

    //Print PDF
    // Process PDF document
    private async setPdfPath(data): Promise<PdfProcessContext> {
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
        if (
            await fs
                .access(logFileName)
                .then(() => true)
                .catch(() => false)
        ) {
            await this.writeLog(
                `\n---------------------------------------------`,
                undefined,
                logFileName,
            );
            await this.writeLog(`\n`, undefined, logFileName);
        }
        return {
            logFileName,
            pdfDirectory,
        };
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
                    this.runPdfProcessJob(
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

    private async runPdfProcessJob(
        body: filesData & PdfProcessContext,
        jobId: string,
    ) {
        return this.pdfProcessContext.run(
            {
                logFileName: body.logFileName,
                pdfDirectory: body.pdfDirectory,
            },
            async () => {
                const totalStartTime = Date.now();
                this.pdfJobStatusMap.set(jobId, {
                    ...(this.pdfJobStatusMap.get(jobId) || {
                        jobId,
                        queuedAt: new Date().toISOString(),
                    }),
                    status: 'running',
                    message: 'Background processing is running',
                    startedAt: new Date().toISOString(),
                });
                try {
                    await this.writeLog(
                        `[${jobId}] Background processing started`,
                    );
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
                    const tagdata = await this.saveTagsData(dbdata);
                    const fileID = tagdata.FILES;
                    await this.writeLog(
                        `Saved PDF data in ${this.formatElapsedTime(saveStartTime)}`,
                    );

                    // ขั้นตอนที่ 4: ใส่รูปภาพto PDF
                    await this.putImages(fileID);

                    // ขั้นตอนที่ 5: ใส่ CN No. ลงใน PDF
                    await this.putCNNo(fileID);

                    // ขั้นตอนที่ 5: ใส่เลขที่ Lot แรกลงใน PDF

                    await this.putFirstLot(dbdata.bmdate);

                    // ขั้นตอนที่ 6: รวม PDF กลับมาเป็น 1 ไฟล์
                    const outFilePath = path.join(
                        outputDirectory,
                        `${dbdata.filename}`,
                    );
                    const mergeStartTime = Date.now();
                    await this.mergePdfsFast(splitFilesData, outFilePath);
                    await this.writeLog(
                        `Merged PDF in ${this.formatElapsedTime(mergeStartTime)}`,
                    );

                    const compressStartTime = Date.now();
                    await this.compressPdfWithGhostscript(outFilePath);
                    await this.writeLog(
                        `Compressed PDF in ${this.formatElapsedTime(compressStartTime)}`,
                    );
                    await this.allowPrint(
                        dbdata.folder,
                        dbdata.originalfilename,
                        fileID,
                    );
                    await this.writeLog(
                        `Total processing time ${this.formatElapsedTime(totalStartTime)}`,
                    );
                    this.pdfJobStatusMap.set(jobId, {
                        ...(this.pdfJobStatusMap.get(jobId) || { jobId }),
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
                } catch (error) {
                    try {
                        await fs.unlink(body.inputPath);
                        await this.writeLog(
                            `[${jobId}] Deleted input file after process error: ${body.inputPath}`,
                        );
                    } catch (unlinkError) {
                        await this.writeLog(
                            `[${jobId}] Failed to delete input file after process error`,
                            unlinkError instanceof Error
                                ? unlinkError.message
                                : String(unlinkError),
                        );
                    }
                    this.pdfJobStatusMap.set(jobId, {
                        ...(this.pdfJobStatusMap.get(jobId) || { jobId }),
                        status: 'failed',
                        message: 'Background processing failed',
                        finishedAt: new Date().toISOString(),
                        error:
                            error instanceof Error
                                ? error.message
                                : String(error),
                    });
                    await this.writeLog(
                        `[${jobId}] Background processing failed`,
                        error instanceof Error ? error.message : String(error),
                    );
                    return;
                }
            },
        );
    }

    private async splitFiles(
        pdfDoc: PDFDocument,
        outputDirectory: string,
        pageCount: number,
        splitFilesData: {
            fileName: string;
            filePath: string;
            pageNumber: number;
        }[],
    ) {
        const splitStartTime = Date.now();
        for (let i = 1; i < pageCount; i++) {
            const singlePageDoc = await PDFDocument.create();
            const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [i]);
            singlePageDoc.addPage(copiedPage);
            const singlePageBytes = await singlePageDoc.save();
            const parser = new PDFParse({
                data: Buffer.from(singlePageBytes),
            });
            let parsedData;
            try {
                parsedData = await parser.getText();
                const textContent = parsedData.text;
                const tagData = textContent.split('\n');
                const tagNo = tagData[0].substring(0, 12).replace(/\s/g, '');
                const newFileName = `${tagNo}.pdf`;
                const outputPath = path.join(outputDirectory, newFileName);
                await fs.writeFile(outputPath, singlePageBytes);
                splitFilesData.push({
                    fileName: tagNo,
                    filePath: outputPath,
                    pageNumber: i,
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

    private formatElapsedTime(startTime: number) {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const ms = elapsed % 1000;
        if (minutes > 0) return `${minutes} min ${seconds} sec ${ms} ms`;
        if (seconds > 0) return `${seconds} sec ${ms} ms`;
        return `${ms} ms`;
    }

    private getCurrentPdfDirectory(): string {
        const context = this.pdfProcessContext.getStore();
        if (!context?.pdfDirectory) {
            throw new Error('PDF process context is not initialized');
        }
        return context.pdfDirectory;
    }

    private async writeLog(
        message: string,
        error?: unknown,
        logFileName?: string,
    ) {
        const context = this.pdfProcessContext.getStore();
        const targetLogFileName = logFileName ?? context?.logFileName;
        if (!targetLogFileName) {
            return;
        }
        await this.fileLogger.log(message, {
            fileName: targetLogFileName,
            error,
        });
    }

    private async saveTagsData(data: filesData) {
        const splitFilesData = data.splitFilesData || [];
        return this.repo.createPrint(
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
                    PAGE_TAG: fileData.fileName,
                    PAGE_STATUS: '0',
                })),
        );
    }

    //Start: Put photo to PDF
    private async putImages(filesId: number) {
        const putImagesStartTime = Date.now();
        const imageData = await this.repo.findImage({
            filters: [
                { field: 'FILES_ID', op: 'eq', value: filesId },
                { field: 'PAGE_IMG', op: 'isNull' },
            ],
        });

        if (imageData.length === 0) {
            await this.writeLog(
                `No images to put in PDF for FILES_ID ${filesId}`,
            );
            return;
        }

        for (const img of imageData) {
            try {
                if (!img.DWG_IMG) continue;
                const imagePath = await this.setImagePath(img.DWG_IMG);
                if (imagePath == null) continue;
                const pdfPath = path.join(
                    this.getCurrentPdfDirectory(),
                    `${img.PAGE_TAG}.pdf`,
                );

                await this.embedImageToPdf(
                    pdfPath,
                    imagePath,
                    `${img.DWG_WEIGHT == null ? 0 : img.DWG_WEIGHT} ${img.DWG_WEIGHT_UNIT}/${img.DWG_UNIT}`,
                );
                await this.writeLog(
                    `Put image ${img.DWG_IMG} to ${img.PAGE_TAG}`,
                );
                await this.repo.updatePageImage(
                    img.FILES_ID,
                    img.PAGE_NUM,
                    img.DWG_IMG,
                );
            } catch (error) {
                await this.writeLog(
                    `Error processing image for tag ${img.PAGE_TAG}`,
                    error.message,
                );
            }
        }

        await this.writeLog(
            `Put images in complete PDF in ${this.formatElapsedTime(putImagesStartTime)}`,
        );
    }

    private async setImagePath(img: string) {
        const image = path.join(process.env.IDTAG_FILE_PATH, `images/`, img);
        const thumb = path.join(process.env.IDTAG_FILE_PATH, `thumbnail/`, img);
        const fileExists = await fs
            .access(thumb)
            .then(() => true)
            .catch(() => false);

        if (fileExists) {
            return thumb;
        }

        const chkImgExists = await fs
            .access(image)
            .then(() => true)
            .catch(() => false);
        if (!chkImgExists) return null;

        const imageBytes = await fs.readFile(image);
        await compressDimension(imageBytes, 'image/jpeg', 500).then(
            (compressedBuffer) => {
                return fs.writeFile(thumb, compressedBuffer);
            },
        );
        return thumb;
    }

    private async embedImageToPdf(
        pdfPath: string,
        imagePath: string,
        text: string,
    ) {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [page] = pdfDoc.getPages();
        if (!page) {
            throw new Error(`PDF file has no pages: ${pdfPath}`);
        }

        const opt = {
            pdfpage: page,
            fontsize: 14,
            drawBorder: {
                color: rgb(0, 0, 0),
                width: 1,
            },
            text: '',
            boxX: 283,
            boxY: 685,
            boxWidth: 270,
            boxHeight: 100,
            align: 'left',
        };
        await writeLineBox(opt);
        const imageBytes = await fs.readFile(imagePath);
        const extension = path.extname(imagePath).toLowerCase();
        const embeddedImage = ['.jpg', '.jpeg'].includes(extension)
            ? await pdfDoc.embedJpg(imageBytes)
            : extension === '.png'
              ? await pdfDoc.embedPng(imageBytes)
              : null;

        if (!embeddedImage) {
            throw new Error(`Unsupported image type: ${extension}`);
        }

        const imgHeight = 100;
        const imgWidth = Math.ceil(
            (embeddedImage.width / embeddedImage.height) * imgHeight,
        );

        const imgX = 270 - imgWidth + 283;
        const imgY = 79;
        page.drawImage(embeddedImage, {
            x: imgX,
            y: imgY,
            width: imgWidth,
            height: imgHeight,
        });

        const labelGap = 5;
        const labelWidth = 20;
        const labelHeight = imgHeight;
        const labelX = imgX - labelGap - labelWidth;
        const labelY = imgY;
        page.drawRectangle({
            x: labelX,
            y: labelY,
            width: labelWidth,
            height: labelHeight,
            borderWidth: 1,
            borderColor: rgb(0, 0, 0),
        });

        page.drawText(text, {
            x: labelX + 13,
            y: labelY + 15,
            size: 14,
            color: rgb(0, 0, 0),
            rotate: degrees(90),
        });
        await fs.writeFile(pdfPath, await pdfDoc.save());
    }
    //End: Put photo to PDF

    //Start: Put Text to PDF
    private async putCNNo(filesId: number) {
        const cnStartTime = Date.now();
        const cnData = await this.repo.findCndata({
            filters: [
                { field: 'FILES_ID', op: 'eq', value: filesId },
                { field: 'PAGE_CN', op: 'isNull' },
            ],
        });

        if (cnData.length === 0) {
            await this.writeLog(
                `No CN data to put in PDF for FILES_ID ${filesId}`,
            );
            return;
        }

        for (const data of cnData) {
            const pdfPath = path.join(
                this.getCurrentPdfDirectory(),
                `${data.PAGE_TAG}.pdf`,
            );
            try {
                await this.embedCNToPdf(pdfPath, {
                    cnno: data.DOCNO,
                    sendto: data.SENTTO,
                    senddate: data.PRDCTNAME,
                });
                await this.writeLog(
                    `Put CN No. ${data.DOCNO} to ${data.PAGE_TAG}`,
                );
            } catch (error) {
                await this.writeLog(
                    `Error processing CN Data for tag ${data.PAGE_TAG}`,
                    error.message,
                );
            }
        }

        await this.writeLog(
            `Put CN No. in complete PDF in ${this.formatElapsedTime(cnStartTime)}`,
        );
    }

    private async putFirstLot(bmdate: Date | string) {
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
            await this.writeLog(
                `Skip First Lot lookup due to query error for BMDate ${bmdateStr}`,
                error instanceof Error ? error.message : String(error),
            );
            return;
        }

        let lotCount = 0;
        for (const data of firstData) {
            const pdfPath = path.join(
                this.getCurrentPdfDirectory(),
                `${data.R27M11}.pdf`,
            );
            try {
                await this.embedCNToPdf(pdfPath, {
                    cnno: data.R27M09,
                });
                await this.writeLog(
                    `Put First Lot. No. ${data.R27M09} to ${data.R27M11}`,
                );
                lotCount++;
            } catch (error) {
                continue;
            }
        }

        if (lotCount === 0) {
            await this.writeLog(
                `No First Lot No. data to put in PDF for BMDate ${bmdateStr}`,
            );
            return;
        }
        await this.writeLog(
            `Put first Lot No. in complete PDF in ${this.formatElapsedTime(firstStartTime)}`,
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
            text: `${text.cnno}`,
            align: 'center',
            boxX: 345,
            boxY: 164,
            boxWidth: 129,
            drawBorder: {
                color: rgb(0.9, 0.9, 0.9),
                width: 0,
                bgColor: rgb(0.9, 0.9, 0.9),
            },
        });

        if (text.sendto) {
            await writeLineBox({
                ...opt,
                text: `PLEASE SEND TO ${text.sendto} ON ${text.senddate}`,
                align: 'left',
                boxX: 15,
                boxY: 790,
            });
        }
        await fs.writeFile(pdfPath, await pdfDoc.save());
    }

    private async mergePdfsFast(
        filesData: { filePath: string }[],
        outputPath: string,
    ) {
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
            await this.writeLog(
                `Merged batch ${i / BATCH_SIZE + 1} (${batch.length} files) in ${this.formatElapsedTime(batchStartTime)}`,
            );
        }

        const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
        await fs.writeFile(outputPath, mergedPdfBytes);
    }

    private async compressPdfWithGhostscript(inputPath: string) {
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

    private async allowPrint(
        folder: string,
        filename: string,
        filesId: number,
    ) {
        //0 => On process, 1 => Hold, 2 => Pending Print, 3 => Printed, 4 => Error
        const data = await this.repo.findPrintList({
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
        return await this.repo.updatePrintFileStatus(filesId, status);
    }
    // End Process PDF document

    async findMaster() {
        return this.repo.findPrintList();
    }

    async findAllFiles(dto: SearchIdtagFilesDto) {
        return this.repo.findAllFiles(dto);
    }

    async findFilesLog(id: number) {
        const fileData = await this.repo.findFileById(id);
        const pdfContext = await this.setPdfPath({
            schd_number: fileData.SCHDNUMBER,
            schd_txt: fileData.SCHDCHAR,
            schd_p: fileData.SCHDP,
            filedir: fileData.FILE_FOLDER,
            filename: fileData.FILE_ONAME,
        });
        try {
            return await this.fileLogger.readLog({
                fileName: pdfContext.logFileName,
            });
        } catch {
            throw new Error('Log file not found');
        }
    }

    async downloadFile(id: number) {
        const fileData = await this.repo.findFileById(id);
        if (!fileData) {
            throw new Error('File not found');
        }

        const pdfContext = await this.setPdfPath({
            schd_number: fileData.SCHDNUMBER,
            schd_txt: fileData.SCHDCHAR,
            schd_p: fileData.SCHDP,
            filedir: fileData.FILE_FOLDER,
            filename: fileData.FILE_ONAME,
        });
        try {
            return {
                filePath: pdfContext.pdfDirectory,
                fileName: fileData.FILE_ONAME,
            };
        } catch {
            throw new Error('File not found');
        }
    }

    async updatePrintFileStatus(filesId: number, status: number, page: number) {
        const file = await this.repo.updatePrintFileStatus(filesId, status);
        const pages = await this.repo.updatePrintPagesStatus(filesId, status);
        return { file, pages };
    }

    async deletePdf(filesId: number) {
        const fileData = await this.repo.findFileById(filesId);
        const pdfContext = await this.setPdfPath({
            schd_number: fileData.SCHDNUMBER,
            schd_txt: fileData.SCHDCHAR,
            schd_p: fileData.SCHDP,
            filedir: fileData.FILE_FOLDER,
            filename: fileData.FILE_ONAME,
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
}
