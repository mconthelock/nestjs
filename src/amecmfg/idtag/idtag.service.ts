import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PDFDocument } from 'pdf-lib';
import { PDFParse } from 'pdf-parse';
import * as fs from 'fs/promises';
import * as path from 'path';

import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class IdtagService {
    private formatElapsedTime(startTime: number) {
        return `${Date.now() - startTime} ms`;
    }

    constructor(
        @InjectRepository(M008KP, 'amecConnection')
        private readonly m08: Repository<M008KP>,
        @InjectRepository(F110KP, 'amecConnection')
        private readonly f11: Repository<F110KP>,
        @InjectRepository(F001KP, 'amecConnection')
        private readonly f01: Repository<F001KP>,
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
    async processPdfDocument() {
        const totalStartTime = Date.now();
        try {
            const outputDirectory = path.join(
                process.env.IDTAG_FILE_PATH,
                'output/',
            );
            await fs.mkdir(outputDirectory, { recursive: true });
            console.log(
                `[Idtag] Prepared output directory in ${this.formatElapsedTime(totalStartTime)}`,
            );

            const inputFilePath = path.join(
                process.env.IDTAG_FILE_PATH,
                'TAGSUB.pdf',
                // 'input.pdf',
            );
            // อ่านไฟล์ต้นฉบับ
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
                const pageStartTime = Date.now();
                // สร้างเอกสารใหม่สำหรับ 1 หน้า
                const singlePageDoc = await PDFDocument.create();
                const [copiedPage] = await singlePageDoc.copyPages(pdfDoc, [i]);
                singlePageDoc.addPage(copiedPage);
                const singlePageBytes = await singlePageDoc.save();
                // อ่านข้อความในหน้านั้นๆ เพื่อหาชื่อไฟล์
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
                    // กำหนดชื่อไฟล์และ Path
                    const newFileName = `${tagNo}_page${i}.pdf`;
                    const outputPath = path.join(outputDirectory, newFileName);
                    // บันทึกไฟล์แยกแต่ละหน้า
                    await fs.writeFile(outputPath, singlePageBytes);
                    splitFilesData.push({
                        fileName: tagNo,
                        filePath: outputPath,
                        pageNumber: i + 1,
                    });
                    // console.log(
                    //     `[Idtag] Processed page ${i + 1} (${tagNo}) in ${this.formatElapsedTime(pageStartTime)}`,
                    // );
                    // ขั้นตอนที่ 3: บันทึกข้อมูลลง Database (เรียกใช้ฟังก์ชันจำลอง)
                    // await this.saveToDatabase(extractedName, outputPath, i + 1);
                } finally {
                    await parser.destroy();
                }
            }
            console.log(
                `[Idtag] Split ${splitFilesData.length} pages in ${this.formatElapsedTime(splitStartTime)}`,
            );

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

            //   return { status: 'success', totalPages: pageCount };
            return '';
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการประมวลผล PDF', error);
            throw error;
        }
    }

    // ฟังก์ชันจำลองการทำงานของ Database

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

        const mergedPdfBytes = await mergedPdf.save();
        await fs.writeFile(outputPath, mergedPdfBytes);
        console.log(
            `[Idtag] Saved merged PDF in ${this.formatElapsedTime(mergeStartTime)}`,
        );
    }
}
