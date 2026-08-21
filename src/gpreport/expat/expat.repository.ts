import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { ExpatEmployee } from 'src/common/Entities/gpreport/table/expat_employee.entity';
import { ExpatFamily } from 'src/common/Entities/gpreport/table/expat_family.entity';
import { ExpatEmployeeFile } from 'src/common/Entities/gpreport/table/expat_employee_file.entity';
import { ExpatFamilyFile } from 'src/common/Entities/gpreport/table/expat_family_file.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';
@Injectable()
export class ExpatRepository extends BaseRepository {
    constructor(
        @InjectDataSource('gpreportConnection')
        private readonly gpreportDs: DataSource,

        @InjectDataSource('amecConnection')
        private readonly amecDs: DataSource,
    ) {
        super(gpreportDs);
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

    // =====================================================
    // FAMILY
    // =====================================================

    findFamily(sempno: string) {
        return this.getRepository(ExpatFamily).find({
            where: {
                SEMPNO: sempno,
            },
            order: {
                FID: 'ASC',
            },
        });
    }

    findOneFamily(sempno: string, fid: number) {
        return this.getRepository(ExpatFamily).findOne({
            where: {
                SEMPNO: sempno,
                FID: fid,
            },
        });
    }

    async getNextFamilyId(sempno: string) {
        const result = await this.getRepository(ExpatFamily)
            .createQueryBuilder('F')
            .select('NVL(MAX(F.FID), 0) + 1', 'FID')
            .where('F.SEMPNO = :sempno', { sempno })
            .getRawOne();

        return Number(result.FID);
    }

    createFamily(data: Partial<ExpatFamily>) {
        const repository = this.getRepository(ExpatFamily);
        const family = repository.create(data);

        return repository.save(family);
    }

    async updateFamily(
        sempno: string,
        fid: number,
        data: Partial<ExpatFamily>,
    ) {
        await this.getRepository(ExpatFamily).update(
            {
                SEMPNO: sempno,
                FID: fid,
            },
            data,
        );

        return this.findOneFamily(sempno, fid);
    }

    deleteFamily(sempno: string, fid: number) {
        return this.getRepository(ExpatFamily).delete({
            SEMPNO: sempno,
            FID: fid,
        });
    }


    // =====================================================
    // EMPLOYEE FILE
    // =====================================================

    findEmployeeFiles(sempno: string) {
        return this.getRepository(ExpatEmployeeFile).find({
            where: {
                SEMPNO: sempno,
            },
            order: {
                FILE_TYPE: 'ASC',
                FILE_ID: 'ASC',
            },
        });
    }

    async getNextEmployeeFileId(
        sempno: string,
        fileType: string,
    ) {
        const result = await this.getRepository(ExpatEmployeeFile)
            .createQueryBuilder('F')
            .select('NVL(MAX(F.FILE_ID), 0) + 1', 'FILE_ID')
            .where('F.SEMPNO = :sempno', { sempno })
            .andWhere('F.FILE_TYPE = :fileType', { fileType })
            .getRawOne();

        return Number(result.FILE_ID);
    }

    createEmployeeFile(data: Partial<ExpatEmployeeFile>) {
        const repository = this.getRepository(ExpatEmployeeFile);
        const file = repository.create(data);

        return repository.save(file);
    }

    deleteEmployeeFile(
        sempno: string,
        fileType: string,
        fileId: number,
    ) {
        return this.getRepository(ExpatEmployeeFile).delete({
            SEMPNO: sempno,
            FILE_TYPE: fileType,
            FILE_ID: fileId,
        });
    }


    // =====================================================
    // FAMILY FILE
    // =====================================================

    findFamilyFiles(
        sempno: string,
        fid: number,
    ) {
        return this.getRepository(ExpatFamilyFile).find({
            where: {
                SEMPNO: sempno,
                FID: fid,
            },
            order: {
                FILE_TYPE: 'ASC',
                FILE_ID: 'ASC',
            },
        });
    }

    async getNextFamilyFileId(
        sempno: string,
        fid: number,
        fileType: string,
    ) {
        const result = await this.getRepository(ExpatFamilyFile)
            .createQueryBuilder('F')
            .select('NVL(MAX(F.FILE_ID), 0) + 1', 'FILE_ID')
            .where('F.SEMPNO = :sempno', { sempno })
            .andWhere('F.FID = :fid', { fid })
            .andWhere('F.FILE_TYPE = :fileType', { fileType })
            .getRawOne();

        return Number(result.FILE_ID);
    }

    createFamilyFile(data: Partial<ExpatFamilyFile>) {
        const repository = this.getRepository(ExpatFamilyFile);
        const file = repository.create(data);

        return repository.save(file);
    }

    deleteFamilyFile(
        sempno: string,
        fid: number,
        fileType: string,
        fileId: number,
    ) {
        return this.getRepository(ExpatFamilyFile).delete({
            SEMPNO: sempno,
            FID: fid,
            FILE_TYPE: fileType,
            FILE_ID: fileId,
        });
    }

    findAmecEmployee(sempno: string) {
        return this.amecDs
            .getRepository(AMECUSERALL)
            .createQueryBuilder('U')
            .select([
                'U.SEMPNO',
                'U.SNAME',
                'U.BIRTHDAY',
                'U.SDIVCODE',
                'U.SDIV',
                'U.SRECMAIL',
                'U.SPOSITION',
            ])
            .where('U.SEMPNO = :sempno', { sempno })
            .getOne();
    }
}