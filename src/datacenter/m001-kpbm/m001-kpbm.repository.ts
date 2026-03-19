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
}
