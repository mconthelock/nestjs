import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { FLOWMST } from 'src/common/Entities/webform/table/FLOWMST.entity';

@Injectable()
export class FlowmstRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from FLOWMST`);
        // return this.getRepository(FLOWMST).find();
        return this.manager.find(FLOWMST);
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(FLOWMST, 'F');
        this.applyFilters(qb, 'F', dto, [
            'NFRMNO',
            'VORGNO',
            'CYEAR',
            'CSTEPNO',
        ]);
        return qb.getMany();
    }

    getFlowMaster(NFRMNO: number, VORGNO: string, CYEAR: string) {
        return this.getRepository(FLOWMST).query(
            `SELECT TO_CHAR(NFRMNO) AS NFRMNO, A.*
            FROM FLOWMST A
            START WITH NFRMNO = :1
                AND vOrgNo = :2
                AND cYear = :3
                AND cStart = '1'
            CONNECT BY NFRMNO = :4
                AND vOrgNo = :5
                AND cYear = :6
                AND cStepNo = PRIOR cStepNextNo`,
            [NFRMNO, VORGNO, CYEAR, NFRMNO, VORGNO, CYEAR],
        );
    }
}
