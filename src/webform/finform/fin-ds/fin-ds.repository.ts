import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { DS_STAMP_REPORT } from "src/common/Entities/webform/views/FINDS_STAMP_REPORT.entity";
import { DSDUTYSTAMP } from 'src/common/Entities/webform/table/FINDS_DUTY_STAMP.entity';
import { DSREQDETAIL } from 'src/common/Entities/webform/table/FINDS_REQ_DETAIL.entity';
import { DSREQHEAD } from 'src/common/Entities/webform/table/FINDS_REQ_HEAD.entity';
import { FIN_FILE } from 'src/common/Entities/webform/table/FIN_FILE.entity';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';

@Injectable()
export class FinDsRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    findall() {
        return this.getRepository(DSDUTYSTAMP).find({
            where: {
                ACTIVE: '1',
            },
            order: {
                DUTY_VALUE: 'asc',
            },
        });
    }

    async findAllHead() {
        return this.getRepository(DSREQHEAD).find({
            order: {
                NRUNNO: 'desc',
            },
        });
    }

    async findHeadByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        return this.getRepository(DSREQHEAD)
            .createQueryBuilder('HEAD')
            .select('HEAD.NFRMNO', 'NFRMNO')
            .addSelect('HEAD.VORGNO', 'VORGNO')
            .addSelect('HEAD.CYEAR', 'CYEAR')
            .addSelect('HEAD.CYEAR2', 'CYEAR2')
            .addSelect('HEAD.NRUNNO', 'NRUNNO')
            .addSelect('HEAD.OPTION_CODE', 'OPTION_CODE')
            .addSelect(
                "TO_CHAR(HEAD.EFFECTIVE_DATE, 'YYYY-MM-DD')",
                'EFFECTIVE_DATE',
            )
            .addSelect(
                "TO_CHAR(HEAD.DATE_RECEIVE, 'YYYY-MM-DD')",
                'DATE_RECEIVE',
            )
            .addSelect('HEAD.LOCATION', 'LOCATION')
            .where('HEAD.NFRMNO = :NFRMNO', { NFRMNO: nfrmno })
            .andWhere('HEAD.VORGNO = :VORGNO', { VORGNO: vorgno })
            .andWhere('HEAD.CYEAR = :CYEAR', { CYEAR: cyear })
            .andWhere('HEAD.CYEAR2 = :CYEAR2', { CYEAR2: cyear2 })
            .andWhere('HEAD.NRUNNO = :NRUNNO', { NRUNNO: nrunno })
            .getRawOne();
    }

    async findDetailByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        return this.getRepository(DSREQDETAIL).find({
            where: {
                NFRMNO: nfrmno,
                VORGNO: vorgno,
                CYEAR: cyear,
                CYEAR2: cyear2,
                NRUNNO: nrunno,
            },
            order: {
                LINEID: 'asc',
            },
        });
    }

    // ดึงไฟล์แนบของเอกสารนี้
    async findFilesByForm(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        return this.getRepository(FIN_FILE).find({
            where: {
                NFRMNO: nfrmno,
                VORGNO: vorgno,
                CYEAR: cyear,
                CYEAR2: cyear2,
                NRUNNO: nrunno,
            },
            order: {
                FILE_ID: 'asc',
            },
        });
    }

    // ดึงไฟล์เดียวไว้ใช้ตอน download
    async findFileById(fileId: number) {
        return this.getRepository(FIN_FILE).findOne({
            where: {
                FILE_ID: fileId,
            },
        });
    }

    async findOneForShow(
        nfrmno: number,
        vorgno: string,
        cyear: string,
        cyear2: string,
        nrunno: number,
    ) {
        const head = await this.findHeadByForm(nfrmno, vorgno, cyear, cyear2, nrunno);

        const detail = await this.findDetailByForm(
            nfrmno,
            vorgno,
            cyear,
            cyear2,
            nrunno,
        );

        const files = await this.findFilesByForm(nfrmno, vorgno, cyear, cyear2, nrunno);

        return {
            head,
            detail,
            files,
        };
    }

    async createHead(data: Partial<DSREQHEAD>) {
        return this.getRepository(DSREQHEAD).save(data);
    }

    async updateDateReceive(form: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        CYEAR2: string;
        NRUNNO: number;
    }, dateReceive: string) {
        return this.getRepository(DSREQHEAD)
            .createQueryBuilder()
            .update(DSREQHEAD)
            .set({
                DATE_RECEIVE: () => "TO_DATE(:DATE_RECEIVE, 'YYYY-MM-DD')",
            } as any)
            .where('NFRMNO = :NFRMNO', { NFRMNO: form.NFRMNO })
            .andWhere('VORGNO = :VORGNO', { VORGNO: form.VORGNO })
            .andWhere('CYEAR = :CYEAR', { CYEAR: form.CYEAR })
            .andWhere('CYEAR2 = :CYEAR2', { CYEAR2: form.CYEAR2 })
            .andWhere('NRUNNO = :NRUNNO', { NRUNNO: form.NRUNNO })
            .setParameter('DATE_RECEIVE', dateReceive)
            .execute();
    }

    async createdetail(data: DSREQDETAIL) {
        return this.getRepository(DSREQDETAIL).save(data);
    }

    async findReport(FYEAR: number) {
        return this.getRepository(DS_STAMP_REPORT)
            .createQueryBuilder('REPORT')
            .select('REPORT.FYEAR', 'FYEAR')
            .addSelect("TO_CHAR(HEAD.EFFECTIVE_DATE, 'YYYY-MM-DD')", 'EFFECTIVE_DATE')
            .addSelect("TO_CHAR(HEAD.DATE_RECEIVE, 'YYYY-MM-DD')", 'DATE_RECEIVE')
            .addSelect('REPORT.NFRMNO', 'NFRMNO')
            .addSelect('REPORT.VORGNO', 'VORGNO')
            .addSelect('REPORT.CYEAR', 'CYEAR')
            .addSelect('REPORT.CYEAR2', 'CYEAR2')
            .addSelect('REPORT.NRUNNO', 'NRUNNO')
            .addSelect('HEAD.OPTION_CODE', 'OPTION_CODE')
            .addSelect('REPORT.REASON', 'REASON')
            .addSelect('REPORT.VREQNO', 'VREQNO')
            .addSelect('REPORT.REQUESTER', 'REQUESTER')
            .addSelect('REPORT.BUY_1_QTY', 'BUY_1_QTY')
            .addSelect('REPORT.BUY_1_AMT', 'BUY_1_AMT')
            .addSelect('REPORT.BUY_5_QTY', 'BUY_5_QTY')
            .addSelect('REPORT.BUY_5_AMT', 'BUY_5_AMT')
            .addSelect('REPORT.BUY_10_QTY', 'BUY_10_QTY')
            .addSelect('REPORT.BUY_10_AMT', 'BUY_10_AMT')
            .addSelect('REPORT.BUY_20_QTY', 'BUY_20_QTY')
            .addSelect('REPORT.BUY_20_AMT', 'BUY_20_AMT')
            .addSelect('REPORT.WD_1_QTY', 'WD_1_QTY')
            .addSelect('REPORT.WD_1_AMT', 'WD_1_AMT')
            .addSelect('REPORT.WD_5_QTY', 'WD_5_QTY')
            .addSelect('REPORT.WD_5_AMT', 'WD_5_AMT')
            .addSelect('REPORT.WD_10_QTY', 'WD_10_QTY')
            .addSelect('REPORT.WD_10_AMT', 'WD_10_AMT')
            .addSelect('REPORT.WD_20_QTY', 'WD_20_QTY')
            .addSelect('REPORT.WD_20_AMT', 'WD_20_AMT')
            .innerJoin(
                DSREQHEAD,
                'HEAD',
                [
                    'HEAD.NFRMNO = REPORT.NFRMNO',
                    'HEAD.VORGNO = REPORT.VORGNO',
                    'HEAD.CYEAR = REPORT.CYEAR',
                    'HEAD.CYEAR2 = REPORT.CYEAR2',
                    'HEAD.NRUNNO = REPORT.NRUNNO',
                ].join(' AND '),
            )
            .where('REPORT.FYEAR = :FYEAR', { FYEAR })
            .orderBy('HEAD.DATE_RECEIVE', 'ASC')
            .addOrderBy('REPORT.NRUNNO', 'ASC')
            .getRawMany();
    }






}
