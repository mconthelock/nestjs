import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { nullableTsCode } from './ts-process-auto.utils';
import { transactionContext } from 'src/common/interceptors/transaction-context';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { PROC_TSHEADFORM } from 'src/common/Entities/webform/table/PROC_TSHEADFORM.entity';
import { PROC_TSDETFORM } from 'src/common/Entities/webform/table/PROC_TSDETFORM.entity';
import { PROC_TSATTFILE } from 'src/common/Entities/webform/table/PROC_TSATTFILE.entity';
import {
    AutoTsProcessItemDto,
    InsertTsProcessDto,
    TsFormKeyDto,
} from './dto/ts-process.dto';

@Injectable()
export class IeTsRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') private readonly ds: DataSource,
    ) {
        super(ds);
    }

    transaction<T>(work: () => Promise<T>): Promise<T> {
        return this.ds.transaction((manager) =>
            transactionContext.run({ manager }, work),
        );
    }

    lockFormNumber() {
        // Same allocation lock as jig/auto-inspection, before FormCreateService reads the next number.
        return this.manager.query(
            'LOCK TABLE WEBFORM.FORM IN SHARE ROW EXCLUSIVE MODE',
        );
    }

    async processExists(row: AutoTsProcessItemDto): Promise<boolean> {
        const binds: string[] = [row.DWG];
        const conditions = ['TRIM(DWG) = :1'];
        for (const column of ['GNO', 'LNO'] as const) {
            const value = nullableTsCode(row[column]);
            if (value === null) conditions.push(`TRIM(${column}) IS NULL`);
            else {
                binds.push(value);
                conditions.push(`TRIM(${column}) = :${binds.length}`);
            }
        }
        binds.push(row.PROCID_OLD);
        conditions.push(`TRIM(PROCID_OLD) = :${binds.length}`);
        const result = await this.manager.query(
            `SELECT COUNT(*) AS MATCH_COUNT FROM IEDOC.PROC_TSDETFORM WHERE ${conditions.join(' AND ')}`,
            binds,
        );
        return Number(result[0]?.MATCH_COUNT ?? 0) > 0;
    }

    async requireForm(key: TsFormKeyDto) {
        // findOne adds FETCH NEXT 1 ROWS ONLY, incompatible with Oracle FOR UPDATE.
        // The full primary key already limits this query to one row.
        const form = await this.getRepository(FORM)
            .createQueryBuilder('form')
            .where(key)
            .setLock('pessimistic_write')
            .getOne();
        if (!form)
            throw new NotFoundException(
                'WEBFORM.FORM not found; create Form/Flow first or use auto_insert_ts_process',
            );
    }

    async exists(key: TsFormKeyDto) {
        return (await this.getRepository(PROC_TSHEADFORM).countBy(key)) > 0;
    }

    async insert(dto: InsertTsProcessDto) {
        const key = this.key(dto);
        await this.getRepository(PROC_TSHEADFORM).insert(
            dto.HEADERS.map((row) => ({
                ...row,
                ...key,
                INPUTDATE:
                    row.INPUTDATE == null
                        ? row.INPUTDATE
                        : new Date(row.INPUTDATE),
            })),
        );
        if (dto.DETAILS?.length) {
            await this.getRepository(PROC_TSDETFORM).insert(
                dto.DETAILS.map((row) => ({ ...row, ...key })),
            );
        }
        if (dto.FILES?.length) {
            await this.getRepository(PROC_TSATTFILE).insert(
                dto.FILES.map((row) => ({ ...row, ...key })),
            );
        }
    }

    async read(key: TsFormKeyDto) {
        // Sequential queries also work with Oracle's single transaction connection.
        const HEADERS = await this.getRepository(PROC_TSHEADFORM).find({
            where: key,
            order: { SEQ: 'ASC' },
        });
        const DETAILS = await this.getRepository(PROC_TSDETFORM).find({
            where: key,
            order: { SEQ: 'ASC', PROCID: 'ASC' },
        });
        const FILES = await this.getRepository(PROC_TSATTFILE).find({
            where: key,
            order: { ID: 'ASC' },
        });
        return { ...key, HEADERS, DETAILS, FILES };
    }

    async replace(dto: InsertTsProcessDto) {
        await this.remove(this.key(dto));
        await this.insert(dto);
    }

    async remove(key: TsFormKeyDto) {
        await this.getRepository(PROC_TSDETFORM).delete(key);
        await this.getRepository(PROC_TSATTFILE).delete(key);
        await this.getRepository(PROC_TSHEADFORM).delete(key);
    }

    private key(dto: TsFormKeyDto): TsFormKeyDto {
        const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = dto;
        return { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO };
    }
}
