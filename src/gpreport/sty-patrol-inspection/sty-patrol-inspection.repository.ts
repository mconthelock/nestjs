import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { Between, DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_PATROL_INSPECTION } from 'src/common/Entities/gpreport/views/STY_PATROL_INSPECTION.entity';
import { ReportStyPatrolInspectionDto } from './dto/report-sty-patrol-inspection.dto';
import { STY_ITEMS } from 'src/common/Entities/gpreport/table/STY_ITEMS.entity';
import { FormDto } from 'src/webform/center/form/dto/form.dto';
import { STY_TYPE } from 'src/common/Entities/gpreport/table/STY_TYPE.entity';

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

    findDraft(empno: string = '') {
        const query = this.manager
            .createQueryBuilder(STY_PATROL_INSPECTION, 'P')
            .select([
                'P.FORMNO',
                'P.NFRMNO',
                'P.VORGNO',
                'P.CYEAR',
                'P.CYEAR2',
                'P.NRUNNO',
                'P.PA_SECTION',
                'P.OWNER_SECTION',
                'P.PA_OWNER',
                'P.STNAME',
                'P.SNAME',
                'P.SSEC',
                'P.SDEPT',
                'P.SDIV',
                'P.PA_DATE',
                'P.PA_AUDIT',
                'P.CST',
            ])
            .leftJoin(
                'FLOW',
                'F',
                "P.NFRMNO = F.NFRMNO AND P.VORGNO = F.VORGNO AND P.CYEAR = F.CYEAR AND P.CYEAR2 = F.CYEAR2 AND P.NRUNNO = F.NRUNNO AND F.CSTEPNO = '--' AND F.CSTEPST = '3'",
            )
            .orderBy('P.NRUNNO', 'ASC');
        if (empno) {
            query.where('(F.VAPVNO = :empno OR F.VREPNO = :empno)', { empno });
        }
        return query.getMany();
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

    async summaryClass(fyear: string, seccode?: string) {
        return this.manager.query(
            `WITH CLASS_LIST AS (
                SELECT TYPE_NAME AS CLASS, TYPE_NO  FROM STY_TYPE
                WHERE TYPE_CODE = 'PTC' AND TYPE_NO IN (1,2)
            )
            SELECT
                C.CLASS,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 1 THEN 1 END), 0) JAN,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 2 THEN 1 END), 0) FEB,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 3 THEN 1 END), 0) MAR,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 4 THEN 1 END), 0) APR,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 5 THEN 1 END), 0) MAY,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 6 THEN 1 END), 0) JUN,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 7 THEN 1 END), 0) JUL,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 8 THEN 1 END), 0) AUG,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 9 THEN 1 END), 0) SEP,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 10 THEN 1 END), 0) OCT,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 11 THEN 1 END), 0) NOV,
                NVL(SUM(CASE WHEN EXTRACT(MONTH FROM S.PA_DATE) = 12 THEN 1 END), 0) DEC,
                NVL(COUNT(S.TYPE_NO), 0) TOTAL
            FROM CLASS_LIST C
            LEFT JOIN (
                SELECT * FROM STY_PATROL_INSPECTION
                ${seccode ? 'WHERE PA_SECTION = :1' : ''}
            )S
            ON S.TYPE_NO = C.TYPE_NO
            AND S.PA_DATE >= TO_DATE(:2 || '-04-01', 'YYYY-MM-DD')
            AND S.PA_DATE < ADD_MONTHS(
                TO_DATE(:3 || '-04-01', 'YYYY-MM-DD'),
                12
            )
            AND S.CST = '2'
            GROUP BY C.CLASS
            ORDER BY C.CLASS`,
            seccode ? [seccode, fyear, fyear] : [fyear, fyear],
        );
    }

    async summaryDepartment(fyear: string, month: number) {
        return this.manager.query(
            `WITH CLASS_LIST AS (
                SELECT TYPE_NAME AS CLASS, TYPE_NO  FROM STY_TYPE
                WHERE TYPE_CODE = 'PTC' AND TYPE_NO IN (1,2)
            )
            SELECT D.SDEPCODE, D.SDEPT, C.CLASS,  NVL(P.AMOUNT, 0) AS AMOUNT
            FROM AMEC.PDEPARTMENT D
            CROSS JOIN CLASS_LIST C
            LEFT JOIN (
                SELECT SDEPCODE, SDEPT, CLASS, COUNT(CLASS) AS AMOUNT
                FROM STY_PATROL_INSPECTION
                WHERE CST = '2'
                AND PA_DATE >= TO_DATE(:1 || '-04-01', 'YYYY-MM-DD')
                AND PA_DATE < ADD_MONTHS(
                    TO_DATE(:2 || '-04-01', 'YYYY-MM-DD'),
                    12
                )
                AND EXTRACT(MONTH FROM PA_DATE) = :3
                GROUP BY SDEPCODE, SDEPT, CLASS
            ) P ON D.SDEPCODE = P.SDEPCODE AND C.CLASS = P.CLASS
            WHERE D.SDEPCODE != '00'
            AND UPPER(D.SDEPT) NOT LIKE '%CANCEL%'
            ORDER BY SDEPT, CLASS`,
            [fyear, fyear, month],
        );
    }

    //prettier-ignore
    async summaryItem(fyear: string, month: number, className: string, sseccode?: string) {
        const sub = this.manager.createQueryBuilder(STY_PATROL_INSPECTION, 'P')
        .select('P.ITEMS_ID, P.CLASS')
        .where('P.CST = 2')
        .andWhere(`PA_DATE >= TO_DATE(:fyear || '-04-01', 'YYYY-MM-DD')`, { fyear })
        .andWhere(`PA_DATE < ADD_MONTHS(TO_DATE(:fyear || '-04-01', 'YYYY-MM-DD'), 12)`, { fyear })
        .andWhere('EXTRACT(MONTH FROM PA_DATE) = :month', { month })
        .andWhere('P.CLASS = :className', { className });
        if (sseccode) {
            sub.andWhere('P.PA_SECTION = :sseccode', { sseccode });
        }
        return this.manager.createQueryBuilder(STY_ITEMS, 'I')
        .select('I.ITEMS_ID, I.ITEMS_NAME, P.CLASS, COUNT(P.CLASS) AS AMOUNT')
        .innerJoin(STY_TYPE, 'T', "I.ITEMS_TYPE = T.TYPE_ID AND  T.TYPE_CODE = 'PT'")
        .leftJoin(`(${sub.getQuery()})`, 'P', 'I.ITEMS_ID = P.ITEMS_ID')
        .setParameters(sub.getParameters())
        .groupBy('I.ITEMS_ID, I.ITEMS_NAME, P.CLASS')
        .orderBy('I.ITEMS_ID', 'ASC')
        .getRawMany();
    }

    //prettier-ignore
    async summaryItemBySec(fyear: string, month: number, sseccode: string) {
        const sub = this.manager.createQueryBuilder(STY_PATROL_INSPECTION, 'P')
        .select('P.ITEMS_ID AS ITEMS_ID')
        .where('P.CST = 2')
        .andWhere(`PA_DATE >= TO_DATE(:fyear || '-04-01', 'YYYY-MM-DD')`, { fyear })
        .andWhere(`PA_DATE < ADD_MONTHS(TO_DATE(:fyear || '-04-01', 'YYYY-MM-DD'), 12)`, { fyear })
        .andWhere('EXTRACT(MONTH FROM PA_DATE) = :month', { month })
        .andWhere('P.PA_SECTION = :sseccode', { sseccode });
        return this.manager.createQueryBuilder(STY_ITEMS, 'I')
        .select('I.ITEMS_ID, I.ITEMS_NAME, COUNT(P.ITEMS_ID) AS AMOUNT')
        .innerJoin(STY_TYPE, 'T', "I.ITEMS_TYPE = T.TYPE_ID AND  T.TYPE_CODE = 'PT'")
        .leftJoin(`(${sub.getQuery()})`, 'P', 'I.ITEMS_ID = P.ITEMS_ID')
        .setParameters(sub.getParameters())
        .groupBy('I.ITEMS_ID, I.ITEMS_NAME')
        .orderBy('I.ITEMS_ID', 'ASC')
        .getRawMany();
    }

    async summarySection(fyear: string, month: number, deptcode: string) {
        return this.manager.query(
            `WITH CLASS_LIST AS (
                SELECT TYPE_NAME AS CLASS, TYPE_NO  FROM STY_TYPE
                WHERE TYPE_CODE = 'PTC' AND TYPE_NO IN (1,2)
            )
            SELECT O.SSECCODE, O.SSEC, C.CLASS, NVL(P.AMOUNT,0) AS AMOUNT
            FROM ORGANIZATIONS O
            CROSS JOIN CLASS_LIST C
            LEFT JOIN
            (
                SELECT SSECCODE, CLASS, COUNT(CLASS) AS AMOUNT
                FROM STY_PATROL_INSPECTION
                WHERE CST = '2'
                AND PA_DATE >= TO_DATE(:1 || '-04-01', 'YYYY-MM-DD')
                AND PA_DATE < ADD_MONTHS(
                    TO_DATE(:2 || '-04-01', 'YYYY-MM-DD'),
                    12
                )
                AND EXTRACT(MONTH FROM PA_DATE) = :3
                AND PA_SECTION IS NOT NULL
                GROUP BY SSECCODE, CLASS
            ) P ON O.SSECCODE = P.SSECCODE AND P.CLASS = C.CLASS
            WHERE O.SDEPCODE = :4 AND O.CSTATUS = '1' AND O.SSECCODE != '00'`,
            [fyear, fyear, month, deptcode],
        );
    }
}
