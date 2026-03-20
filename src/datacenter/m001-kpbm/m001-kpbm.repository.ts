import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { M001KPBM } from 'src/common/Entities/datacenter/table/M001KPBM.entity';

@Injectable()
export class M001KpbmRepository extends BaseRepository {
    constructor(
        @InjectDataSource('datacenterConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from M001KPBM`);
        // return this.getRepository(M001KPBM).find();
        return this.manager.find(M001KPBM);
    }

    findOne(order: string, item: string, prod: string) {
        return this.getRepository(M001KPBM).findOneBy({
            M1K02: order,
            M1K03: item,
            M1K04: prod,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(M001KPBM, 'M');
        this.applyFilters(qb, 'M', dto, ['M1K02', 'M1K03', 'M1K04']);
        return qb.getMany();
    }

    getGPL(order: string, item: string[]) {
        return this.manager
            .createQueryBuilder(M001KPBM, 'M')
            .select(
                'TRIM(M1K02) AS ORDERNO, TRIM(M1K03) AS ITEM, TRIM(M1K04) AS PROD, TRIM(M1K41) AS PART, TRIM(M1K19) AS D1, TRIM(M1K20) AS D2, TRIM(M1K21) AS G1, TRIM(M1K22) AS L1, TRIM(M1K23) AS L2, TRIM(M1K24) AS L3, TRIM(M1K25) AS L4, TRIM(M1K26) AS L5, TRIM(M1K27) AS L6, TRIM(M1K28) AS L7, TRIM(M1K29) AS L8, TRIM(M1K30) AS L9,TRIM(M1K43) AS P1, TRIM(M1K44) AS P2, TRIM(M1K45) AS P3, TRIM(M1K46) AS P4, TRIM(M1K47) AS P5, TRIM(M1K48) AS P6, TRIM(M1K49) AS P7, TRIM(M1K50) AS P8, TRIM(M1K51) AS P9, TRIM(M1K52) AS P10, TRIM(M1K53) AS P11, TRIM(M1K54) AS P12, TRIM(M1K55) AS P13, TRIM(M1K56) AS P14, TRIM(M1K57) AS P15, TRIM(M1K58) AS P16, TRIM(M1K59) AS P17, TRIM(M1K60) AS P18, TRIM(M1K61) AS P19, TRIM(M1K62) AS P20, TRIM(M1K63) AS P21, TRIM(M1K64) AS P22, TRIM(M1K65) AS P23, TRIM(M1K66) AS P24, TRIM(M1K67) AS P25, TRIM(M1K68) AS P26, TRIM(M1K69) AS P27, TRIM(M1K70) AS P28, TRIM(M1K71) AS P29, TRIM(M1K72) AS P30,TRIM(M1K31) AS SCND, TRIM(M1K34) AS QTY',
            )
            .where('M.M1K02 = :order', { order })
            .andWhere('M.M1K03 in (:...item)', { item })
            .getRawMany();
    }
}
