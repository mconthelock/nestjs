import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import * as dayjs from 'dayjs';
import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';
import { AsyncLocalStorage } from 'async_hooks';

import { writeLineBox } from 'src/common/helpers/file-pdf.helper';
import { exportExcel } from 'src/common/helpers/file-excel.helper';

import { R027mp1Service } from 'src/as400/rtnlibf/r027mp1/r027mp1.service';
import { MailService } from 'src/common/services/mail/mail.service';

import { M008KP } from 'src/as400/rtnlibf/m008kp/entities/m008kp.entity';
import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { F001KP } from 'src/as400/shopf/f001kp/entities/f001kp.entity';

import { IdTagRepository } from './printed/idtag.repository';

@Injectable()
export class IdtagService {
    constructor(
        @InjectRepository(M008KP, 'amecConnection')
        private readonly m08: Repository<M008KP>,
        @InjectRepository(F110KP, 'amecConnection')
        private readonly f11: Repository<F110KP>,
        @InjectRepository(F001KP, 'amecConnection')
        private readonly f01: Repository<F001KP>,

        private mail: MailService,
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
