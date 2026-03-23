import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';

@Injectable()
export class S011mpRepository extends BaseRepository {
    constructor(
        @InjectDataSource('datacenterConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from S011MP`);
        // return this.getRepository(S011MP).find();
        return this.manager.find(S011MP);
    }

    findOne(S11M01: string, S11M02: string) {
        return this.getRepository(S011MP).findOneBy({
            S11M01: Like(`%${S11M01}%`),
            S11M02,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(S011MP, 'S');
        this.applyFilters(qb, 'S', dto, [
            'S11M01',
            'S11M02',
            'S11M03',
            'S11M04',
        ]);
        return qb.getMany();
    }
}
