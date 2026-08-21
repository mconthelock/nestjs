import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { ExpatEmployee } from 'src/common/Entities/gpreport/table/expat_employee.entity';

@Injectable()
export class ExpatRepository extends BaseRepository {
    constructor(
        @InjectDataSource('gpreportConnection')
        ds: DataSource,
    ) {
        super(ds);
    }

    findOneEmployee(sempno: string) {
        return this.getRepository(ExpatEmployee).findOne({
            where: {
                SEMPNO: sempno,
            },
        });
    }

    async findAllEmployees(company?: string) {
        const qb = this.getRepository(ExpatEmployee)
            .createQueryBuilder('E')
            .leftJoin(
                'AMECUSERALL',
                'U',
                'TRIM(U.SEMPNO) = TRIM(E.SEMPNO)',
            )
            .select([
                'E.SEMPNO AS "SEMPNO"',
                'E.PASSPORT_NO AS "PASSPORT_NO"',
                'E.THAI_ADDR AS "THAI_ADDR"',
                'E.TELNO AS "TELNO"',
                'E.EMAIL AS "EMAIL"',
                'E.START_WORK_DATE AS "START_WORK_DATE"',
                'E.SINGLE_WIN_DATE AS "SINGLE_WIN_DATE"',
                'E.VISA_APPT_DATE AS "VISA_APPT_DATE"',
                'E.VISA_EXP_DATE AS "VISA_EXP_DATE"',
                'E.LAST_ARRIVAL_DATE AS "LAST_ARRIVAL_DATE"',
                'E.LAST_ARRIVAL_UPD_DATE AS "LAST_ARRIVAL_UPD_DATE"',
                'E.LAST_90DAY_DATE AS "LAST_90DAY_DATE"',
                'E.LAST_90DAY_UPD_DATE AS "LAST_90DAY_UPD_DATE"',

                'U.SNAME AS "SNAME"',
                'U.STNAME AS "STNAME"',
                'U.SPOSCODE AS "SPOSCODE"',
                'U.SPOSITION AS "SPOSITION"',
                'U.SPOSNAME AS "SPOSNAME"',
                'U.SSECCODE AS "SSECCODE"',
                'U.SSEC AS "SSEC"',
                'U.SDEPCODE AS "SDEPCODE"',
                'U.SDEPT AS "SDEPT"',
                'U.SDIVCODE AS "SDIVCODE"',
                'U.SDIV AS "SDIV"',
                `
                CASE
                    WHEN U.SDIVCODE = '140101' THEN 'RHQ'
                    ELSE 'AMEC'
                END AS "COMPANY"
                `,
            ])
            .orderBy('E.SEMPNO', 'ASC');

        if (company?.toUpperCase() === 'RHQ') {
            qb.andWhere(`U.SDIVCODE = '140101'`);
        }

        if (company?.toUpperCase() === 'AMEC') {
            qb.andWhere(`U.SDIVCODE <> '140101'`);
        }

        return qb.getRawMany();
    }

    async findEmployeeDetail(sempno: string) {
        return this.getRepository(ExpatEmployee)
            .createQueryBuilder('E')
            .leftJoin(
                'AMECUSERALL',
                'U',
                'TRIM(U.SEMPNO) = TRIM(E.SEMPNO)',
            )
            .select([
                'E.SEMPNO AS "SEMPNO"',
                'E.PASSPORT_NO AS "PASSPORT_NO"',
                'E.THAI_ADDR AS "THAI_ADDR"',
                'E.TELNO AS "TELNO"',
                'E.EMAIL AS "EMAIL"',
                'E.START_WORK_DATE AS "START_WORK_DATE"',
                'E.SINGLE_WIN_DATE AS "SINGLE_WIN_DATE"',
                'E.VISA_APPT_DATE AS "VISA_APPT_DATE"',
                'E.VISA_EXP_DATE AS "VISA_EXP_DATE"',
                'E.LAST_ARRIVAL_DATE AS "LAST_ARRIVAL_DATE"',
                'E.LAST_ARRIVAL_UPD_DATE AS "LAST_ARRIVAL_UPD_DATE"',
                'E.LAST_90DAY_DATE AS "LAST_90DAY_DATE"',
                'E.LAST_90DAY_UPD_DATE AS "LAST_90DAY_UPD_DATE"',

                'U.SNAME AS "SNAME"',
                'U.STNAME AS "STNAME"',
                'U.SPOSCODE AS "SPOSCODE"',
                'U.SPOSITION AS "SPOSITION"',
                'U.SPOSNAME AS "SPOSNAME"',
                'U.SSECCODE AS "SSECCODE"',
                'U.SSEC AS "SSEC"',
                'U.SDEPCODE AS "SDEPCODE"',
                'U.SDEPT AS "SDEPT"',
                'U.SDIVCODE AS "SDIVCODE"',
                'U.SDIV AS "SDIV"',
                `
                CASE
                    WHEN U.SDIVCODE = '140101' THEN 'RHQ'
                    ELSE 'AMEC'
                END AS "COMPANY"
                `,
            ])
            .where('E.SEMPNO = :sempno', { sempno })
            .getRawOne();
    }

    createEmployee(data: Partial<ExpatEmployee>) {
        const repository = this.getRepository(ExpatEmployee);
        const employee = repository.create(data);

        return repository.save(employee);
    }

    async updateEmployee(
        sempno: string,
        data: Partial<ExpatEmployee>,
    ) {
        await this.getRepository(ExpatEmployee).update(
            {
                SEMPNO: sempno,
            },
            data,
        );

        return this.findOneEmployee(sempno);
    }
}