import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { Between, DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_PATROL_INSPECTION } from 'src/common/Entities/gpreport/views/STY_PATROL_INSPECTION.entity';
import { ReportStyPatrolInspectionDto } from './dto/report-sty-patrol-inspection.dto';
import { STY_ITEMS } from 'src/common/Entities/gpreport/table/STY_ITEMS.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class StyPatrolInspectionRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findBylength(start: Date, end: Date) {
        return this.getRepository(STY_PATROL_INSPECTION).find({
            select: [
                'FORMNO',
                'NFRMNO',
                'VORGNO',
                'CYEAR',
                'CYEAR2',
                'NRUNNO',
                'PA_SECTION',
                'OWNER_SECTION',
                'PA_OWNER',
                'STNAME',
                'SNAME',
                'SSEC',
                'SDEPT',
                'SDIV',
                'PA_DATE',
                'PA_AUDIT',
                'CST',
            ],
            where: {
                PA_DATE: Between(start, end),
            },
            order: {
                NRUNNO: 'ASC',
            },
        });
    }

     getItemReport(dto: ReportStyPatrolInspectionDto) {
        const sub = this.manager
            .createQueryBuilder()
            .subQuery()
            .select('OWNER_SECTION, CLASS, ITEMS_ID')
            .from(STY_PATROL_INSPECTION, 'P')
            .where('P.CST = 2');

        if (dto.SDATE && dto.EDATE) {
            sub.andWhere('P.PA_DATE BETWEEN :start AND :end', {
                start: dto.SDATE,
                end: dto.EDATE,
            });
        }
        if (dto.SECCODE) {
            sub.andWhere('P.SSECCODE = :seccode', {
                seccode: dto.SECCODE,
            });
        }
        if (dto.CLASS) {
            sub.andWhere('P.CLASS = :class', { class: dto.CLASS });
        }
        const query = this.manager
            .createQueryBuilder(STY_ITEMS, 'I')
            .select(
                'I.ITEMS_ID, I.ITEMS_NAME, I.ITEMS_ENAME, OWNER_SECTION, CLASS, COUNT(OWNER_SECTION) AS AMOUNT',
            )
            .leftJoin(`(${sub.getQuery()})`, 'P', 'I.ITEMS_ID = P.ITEMS_ID')
            .setParameters(sub.getParameters())
            .where('I.ITEMS_TYPE = 2')
            .groupBy(
                'I.ITEMS_ID, I.ITEMS_NAME, I.ITEMS_ENAME, OWNER_SECTION,   CLASS',
            )
            .orderBy('OWNER_SECTION, ITEMS_ID, CLASS', 'ASC');
        return query.getRawMany();
    }

    listByForm(dto: FormDto) {
        return this.getRepository(STY_PATROL_INSPECTION).find({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
            },
            order: {
                PA_ID: 'ASC',
            },
        });
    }
}
