import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { PILINE_EVENT_RECORD } from 'src/common/Entities/workload/table/PILINE_EVENT_RECORD.entity';
import { PILINE_ATT } from 'src/common/Entities/workload/table/PILINE_ATT.entity';
import { PILINE_NG_RECORD } from 'src/common/Entities/workload/table/PILINE_NG_RECORD.entity';

import { F110KP } from 'src/amecmfg/f110kp/entities/f110kp.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineEventRecordRepository extends PilineCrudRepository<PILINE_EVENT_RECORD> {
    constructor(
        @InjectDataSource('workloadConnection') ds: DataSource,
        @InjectDataSource('amecConnection') private readonly amec: DataSource,
    ) { super(ds, PILINE_EVENT_RECORD); }

    async findAll(issueOnly = false) {
        const query = this.getRepository(PILINE_EVENT_RECORD).createQueryBuilder('event')
            .leftJoinAndMapOne('event.NG', PILINE_NG_RECORD, 'ng', 'ng.PILINE_NO = event.PILINE_NO')
            .leftJoinAndMapMany('event.ATT', PILINE_ATT, 'att', 'att.PILINE_NO = event.PILINE_NO')
            .where('(event.RECORD_STATUS IS NULL OR event.RECORD_STATUS <> :deleted)', { deleted: 'DELETE' })
            .orderBy('event.EVENT_DATE', 'DESC').addOrderBy('event.RUN_NO', 'DESC');
        if (issueOnly) {
            query.andWhere('event.IS_NG = :isNg AND event.RECORD_STATUS = :active', { isNg: '1', active: 'ACTIVE' });
        }
        const records = await query.getMany() as (PILINE_EVENT_RECORD & { NG?: PILINE_NG_RECORD; ATT?: PILINE_ATT[] })[];
        const codes = [...new Set(records.flatMap(row => [row.CREATE_BY, row.UPDATE_BY]).filter(Boolean).map(value => value!.trim()))];
        const tags = [...new Set(records.map(row => row.NG?.ID_TAG?.trim()).filter((value): value is string => !!value))];
        const names = new Map<string, string>();
        const products = new Map<string, F110KP>();
        // User names are read through workload; F110KP remains on the AMEC connection.
        // Batch lookups below Oracle's IN-list limit instead of querying per event.
        for (let offset = 0; offset < codes.length; offset += 500) {
            const users = await this.manager.createQueryBuilder()
                .select('U.SEMPNO', 'SEMPNO').addSelect('U.SNAME', 'SNAME')
                .from('AMEC.AMECUSERALL', 'U')
                .where('U.SEMPNO IN (:...codes)', { codes: codes.slice(offset, offset + 500) })
                .getRawMany<{ SEMPNO: string; SNAME: string }>();
            users.forEach(user => names.set(user.SEMPNO.trim(), user.SNAME?.trim()));
        }
        for (let offset = 0; offset < tags.length; offset += 500) {
            const parts = await this.amec.getRepository(F110KP).find({
                select: { F11K01: true, F11K04: true, F11K05: true, F11K06: true, F11K11: true, F11K15: true, F11K16: true, F11K18: true },
                where: { F11K01: In(tags.slice(offset, offset + 500)) },
            });
            parts.forEach(part => products.set(part.F11K01.trim(), part));
        }
        return { status: true, data: records.map(row => {
            const product = products.get(row.NG?.ID_TAG?.trim() || '');
            const material = String(product?.F11K18 ?? '').trim();
            const split = material.match(/^(.*?)\s+(\S+)$/);
            return { ...row,
                CREATE_BY_NAME: names.get(row.CREATE_BY?.trim()) || null,
                UPDATE_BY_NAME: names.get(row.UPDATE_BY?.trim() || '') || null,
                JUN: product?.F11K05?.trim(), P: product?.F11K06?.trim(),
                ORDER_NO: product?.F11K04?.trim().replace(/-/g, ''), ITEM: product?.F11K11?.trim(),
                PART_NAME: product?.F11K15?.trim(), DRAWING: product?.F11K16?.trim(),
                MATERIAL: split ? split[1].trim() : material, THICKNESS: split ? split[2] : null,
            };
        }) };
    }
}
