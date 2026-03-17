import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import * as fs from 'fs/promises';
import * as path from 'path';
const fontkit = require('@pdf-lib/fontkit');
// import fontkit from '@pdf-lib/fontkit';
import { spawn } from 'child_process';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { PDFParse } from 'pdf-parse';
import { compressDimension } from 'src/common/helpers/resize-image.helper';
import {
    drawGrid,
    writeLineBox,
    protectedFile,
} from 'src/common/helpers/file-pdf.helper';

import { FileLoggerService } from 'src/common/services/file-logger/file-logger.service';

import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';

import { IdtagFiles } from '../../common/Entities/workload/table/idtag-files.entity';
import { IdtagPages } from '../../common/Entities/workload/table/idtag-pages.entity';
import { IdtagImages } from '../../common/Entities/workload/views/idtag-images.entity';
import { IdTagRepository } from './idtag.repository';

@Injectable()
export class IdtagService {
    private logFileName = '';
    private readonly imagePlacement = {
        boxLeftRatio: 0.33,
        boxBottomRatio: 0.04,
        boxWidthRatio: 0.65,
        boxHeightRatio: 0.9,
        padding: 6,
    };

    constructor(
        @InjectRepository(M008KP, 'amecConnection')
        private readonly m08: Repository<M008KP>,
        @InjectRepository(F110KP, 'amecConnection')
        private readonly f11: Repository<F110KP>,
        @InjectRepository(F001KP, 'amecConnection')
        private readonly f01: Repository<F001KP>,

        private readonly repo: IdTagRepository,
        private readonly fileLogger: FileLoggerService,
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
    //inputFilePath: string, outputDirectory: string
    private formatElapsedTime(startTime: number) {
        return `${Date.now() - startTime} ms`;
    }

    private async writeLog(message: string, error?: unknown) {
        await this.fileLogger.log(message, {
            fileName: this.logFileName,
            error,
        });
    }

    async processPdfDocument() {
        //await this.putImagesTS();
        //return;
        const totalStartTime = Date.now();
        try {
            this.logFileName = `IDTAG/202603XP2/TAGLZME.log`;
            const outputDirectory = path.join(
                process.env.IDTAG_FILE_PATH,
                'test/TAGLZME/',
            );
            await fs.mkdir(outputDirectory, { recursive: true });
            const inputFilePath = path.join(
                process.env.IDTAG_FILE_PATH,
                'test/TAGLZME.pdf',
            );

            const readStartTime = Date.now();
            const pdfBytes = await fs.readFile(inputFilePath);
            await this.writeLog(
                `Read source PDF in ${this.formatElapsedTime(readStartTime)}`,
            );

            // ขั้นตอนที่ 1: โหลด PDF ด้วย pdf-lib (เมื่อ save จะได้โครงสร้างไฟล์ที่อัปเดตและบีบอัดขึ้น)
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

            // ขั้นตอนที่ 2 & 3: แบ่งหน้า, อ่านข้อความตั้งชื่อไฟล์ และจำลองการบันทึกลง Database
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
                    const tagNo = tagData[0]
                        .substring(0, 12)
                        .replace(/\s/g, '');
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

            // ขั้นตอนที่ 3: บันทึกข้อมูลลง Database
            const saveStartTime = Date.now();
            const tagdata = await this.saveTagsData(splitFilesData, pageCount);
            const fileID = tagdata.file.FILES;
            await this.writeLog(
                `Saved PDF data in ${this.formatElapsedTime(saveStartTime)}`,
            );

            const putImagesStartTime = Date.now();
            await this.putImages(fileID);
            await this.writeLog(
                `Saved PDF data in ${this.formatElapsedTime(putImagesStartTime)}`,
            );

            // ขั้นตอนที่ 4: รวม PDF กลับมาเป็น 1 ไฟล์ให้เร็วที่สุด
            const mergeStartTime = Date.now();
            await this.mergePdfsFast(
                splitFilesData,
                path.join(outputDirectory, 'Merged_Final_1.7.pdf'),
            );
            await this.writeLog(
                `Merged PDF in ${this.formatElapsedTime(mergeStartTime)}`,
            );
            await this.writeLog(
                `Total processing time ${this.formatElapsedTime(totalStartTime)}`,
            );
            //return { status: 'success', totalPages: pageCount };
            return '';
        } catch (error) {
            await this.writeLog('เกิดข้อผิดพลาดในการประมวลผล PDF', { error });
            throw error;
        }
    }

    // Logic การรวมไฟล์ให้เร็วที่สุด
    private async mergePdfsFast(
        filesData: { filePath: string }[],
        outputPath: string,
    ) {
        const mergeStartTime = Date.now();
        const mergedPdf = await PDFDocument.create();
        const BATCH_SIZE = 100;
        for (let i = 0; i < filesData.length; i += BATCH_SIZE) {
            const batchStartTime = Date.now();
            const batch = filesData.slice(i, i + BATCH_SIZE);

            // อ่านไฟล์ใน Batch พร้อมๆ กัน
            const buffers = await Promise.all(
                batch.map((file) => fs.readFile(file.filePath)),
            );

            // นำไฟล์ที่อ่านได้มาใส่ในเอกสารหลัก
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
        await this.writeLog(
            `Merged complete PDF in ${this.formatElapsedTime(mergeStartTime)}`,
        );
        await this.compressPdfWithGhostscript(outputPath);
    }

    private async compressPdfWithGhostscript(filePath: string) {
        const compressStartTime = Date.now();
        const parsedPath = path.parse(filePath);
        const compressedPath = path.join(
            parsedPath.dir,
            `${parsedPath.name}.compressed${parsedPath.ext}`,
        );
        await this.runGhostscript(filePath, compressedPath);
        await this.writeLog(
            `Compressed PDF in ${this.formatElapsedTime(compressStartTime)}`,
        );
        return compressedPath;
    }

    private async runGhostscript(inputPath: string, outputPath: string) {
        const command =
            '\\\\amecnas\\AMECWEB\\wwwroot\\production\\cdn\\Application\\gs\\gs10.00.0\\bin\\gswin32c.exe';
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
                `-sOutputFile=${outputPath}`,
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

    private async saveTagsData(
        splitFilesData: {
            fileName: string;
            pageNumber: number;
        }[],
        pageCount: number,
    ) {
        return this.repo.createPrint(
            {
                SCHDDATE: new Date(),
                SCHDNUMBER: '2026031',
                SCHDP: 'G1',
                FILE_ONAME: 'TAG295G1.pdf',
                FILE_NAME: 'TAG295G1.pdf',
                FILE_FOLDER: 'TAG295G1',
                FILE_TOTALPAGE: pageCount,
                FILE_STATUS: '0',
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
        const pdfDirectory = path.join(
            process.env.IDTAG_FILE_PATH,
            `test`,
            `TAGLZME`,
        );
        const imageData = await this.repo.findImage({
            filters: [
                { field: 'FILES_ID', op: 'eq', value: filesId },
                { field: 'PAGE_IMG', op: 'isNull' },
            ],
        });

        for (const img of imageData) {
            try {
                if (!img.DWG_IMG) {
                    await this.writeLog(
                        `Skip tag ${img.PAGE_TAG}: drawing image is empty`,
                    );
                    continue;
                }

                const imagePath = await this.setImagePath(img.DWG_IMG);
                const pdfPath = path.join(pdfDirectory, `${img.PAGE_TAG}.pdf`);

                await this.embedImageToPdf(
                    pdfPath,
                    imagePath,
                    `${img.DWG_WEIGHT} ${img.DWG_WEIGHT_UNIT}/${img.DWG_UNIT}`,
                );
                await this.repo.updatePageImage(
                    img.FILES_ID,
                    img.PAGE_NUM,
                    img.DWG_IMG,
                );
                await this.writeLog(
                    `Embedded image ${img.DWG_IMG} into ${img.PAGE_TAG}.pdf`,
                );
            } catch (error) {
                await this.writeLog(
                    `Error processing image for tag ${img.PAGE_TAG}`,
                    { error },
                );
            }
        }
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
        const fontPath = path.join(process.cwd(), 'public/fonts/THSarabun.ttf');
        const [pdfBytes, fontBytes] = await Promise.all([
            fs.readFile(pdfPath),
            fs.readFile(fontPath),
        ]);

        const pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDoc.registerFontkit(fontkit);
        const fontstyle = await pdfDoc.embedFont(fontBytes);
        const [page] = pdfDoc.getPages();

        if (!page) {
            throw new Error(`PDF file has no pages: ${pdfPath}`);
        }

        const opt = {
            pdfpage: page,
            fontstyle: fontstyle,
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
            font: fontstyle,
            color: rgb(0, 0, 0),
            rotate: degrees(90),
        });

        await fs.writeFile(pdfPath, await pdfDoc.save());
    }

    //End: Put photo to PDF
    private async putCNNo() {}

    private async putFirstLot() {}
}
