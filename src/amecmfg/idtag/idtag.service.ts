import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';
import { PDFDocument } from 'pdf-lib';
import { PDFParse } from 'pdf-parse';

import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';

import { IdtagFiles } from '../../common/Entities/workload/table/idtag-files.entity';
import { IdtagPages } from '../../common/Entities/workload/table/idtag-pages.entity';

interface tagFileData {
    FILES: number;
    SCHDDATE: Date;
    SCHDNUMBER: string;
    SCHDP: string;
    FILE_ONAME: string;
    FILE_NAME: string;
    FILE_FOLDER: string;
    FILE_TOTALPAGE?: number;
    FILE_STATUS?: string;
    CREATE_DATE?: Date;
    PRINTED_DATE?: Date;
}

interface tagPageData {
    FILES_ID: number;
    PAGE_NUM: number;
    PAGE_TAG: string;
    PAGE_STATUS: string;
}

@Injectable()
export class IdtagService {
    constructor(
        @InjectRepository(M008KP, 'amecConnection')
        private readonly m08: Repository<M008KP>,
        @InjectRepository(F110KP, 'amecConnection')
        private readonly f11: Repository<F110KP>,
        @InjectRepository(F001KP, 'amecConnection')
        private readonly f01: Repository<F001KP>,

        @InjectRepository(IdtagFiles, 'workloadConnection')
        private readonly tagfile: Repository<IdtagFiles>,

        @InjectRepository(IdtagPages, 'workloadConnection')
        private readonly tagpage: Repository<IdtagPages>,

        @InjectDataSource('workloadConnection')
        private wkds: DataSource,
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

    async processPdfDocument() {
        const totalStartTime = Date.now();
        try {
            const outputDirectory = path.join(
                process.env.IDTAG_FILE_PATH,
                'TAG295G1/',
            );
            await fs.mkdir(outputDirectory, { recursive: true });
            console.log(
                `[Idtag] Prepared output directory in ${this.formatElapsedTime(totalStartTime)}`,
            );

            const inputFilePath = path.join(
                process.env.IDTAG_FILE_PATH,
                'TAG295G1.pdf',
            );

            const readStartTime = Date.now();
            const pdfBytes = await fs.readFile(inputFilePath);
            console.log(
                `[Idtag] Read source PDF in ${this.formatElapsedTime(readStartTime)}`,
            );

            // ขั้นตอนที่ 1: โหลด PDF ด้วย pdf-lib (เมื่อ save จะได้โครงสร้างไฟล์ที่อัปเดตและบีบอัดขึ้น)
            const loadStartTime = Date.now();
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const pageCount = pdfDoc.getPageCount();
            console.log(
                `[Idtag] Loaded PDF (${pageCount} pages) in ${this.formatElapsedTime(loadStartTime)}`,
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

            console.log(
                `[Idtag] Split ${splitFilesData.length} pages in ${this.formatElapsedTime(splitStartTime)}`,
            );

            // ขั้นตอนที่ 3: บันทึกข้อมูลลง Database
            await this.saveTagsData(splitFilesData, pageCount);

            // ขั้นตอนที่ 4: รวม PDF กลับมาเป็น 1 ไฟล์ให้เร็วที่สุด
            const mergeStartTime = Date.now();
            await this.mergePdfsFast(
                splitFilesData,
                path.join(outputDirectory, 'Merged_Final_1.7.pdf'),
            );
            console.log(
                `[Idtag] Merged PDF in ${this.formatElapsedTime(mergeStartTime)}`,
            );
            console.log(
                `[Idtag] Total processing time ${this.formatElapsedTime(totalStartTime)}`,
            );
            //return { status: 'success', totalPages: pageCount };
            return '';
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการประมวลผล PDF', error);
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
            console.log(
                `[Idtag] Merged batch ${i / BATCH_SIZE + 1} (${batch.length} files) in ${this.formatElapsedTime(batchStartTime)}`,
            );
        }

        const mergedPdfBytes = await mergedPdf.save({ useObjectStreams: true });
        await fs.writeFile(outputPath, mergedPdfBytes);
        console.log(
            `[Idtag] Saved merged PDF in ${this.formatElapsedTime(mergeStartTime)}`,
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
        // const ghostscriptCommands = await this.getGhostscriptCommands();

        await this.runGhostscript(filePath, compressedPath);
        console.log(
            `[Idtag] compressPdf in ${this.formatElapsedTime(compressStartTime)}`,
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

    private async saveTagsData(splitFilesData, pageCount) {
        const runner = this.wkds.createQueryRunner();
        await runner.connect();
        await runner.startTransaction();
        try {
            const files: tagFileData = {
                FILES: null,
                SCHDDATE: new Date(),
                SCHDNUMBER: '2026031',
                SCHDP: 'G1',
                FILE_ONAME: 'TAG295G1.pdf',
                FILE_NAME: 'TAG295G1.pdf',
                FILE_FOLDER: 'TAG295G1',
                FILE_TOTALPAGE: pageCount,
                FILE_STATUS: '0',
                CREATE_DATE: new Date(),
            };
            const savedFile = await runner.manager.save(IdtagFiles, files);
            for (const fileData of splitFilesData) {
                const page: tagPageData = {
                    FILES_ID: savedFile.FILES,
                    PAGE_NUM: fileData.pageNumber,
                    PAGE_TAG: fileData.fileName,
                    PAGE_STATUS: '0',
                };
                await runner.manager.save(IdtagPages, page);
            }

            await runner.commitTransaction();
        } catch (err) {
            await runner.rollbackTransaction();
            throw err;
        } finally {
            await runner.release();
        }
    }
}
