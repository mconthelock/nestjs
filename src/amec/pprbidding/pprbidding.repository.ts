import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { CreatePprbiddingDto } from './dto/create-pprbidding.dto';
import { PPRBIDDING } from 'src/common/Entities/amec/table/PPRBIDDING.entity';

@Injectable()
export class PprbiddingRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreatePprbiddingDto | CreatePprbiddingDto[]) {
        if (Array.isArray(dto)) {
            return this.getRepository(PPRBIDDING).save(dto);
        }
        return this.getRepository(PPRBIDDING).save(dto);
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from PPRBIDDING`);
        // return this.getRepository(PPRBIDDING).find();
        return this.manager.find(PPRBIDDING);
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(PPRBIDDING, 'P');
        this.applyFilters(qb, 'P', dto, [
            'SPRNO',
            'BIDDINGNO',
            'EBUDGETNO',
            'PR.CAPPROVE',
            'PR.NSTEP'
        ]);
        return qb
            .innerJoinAndSelect('P.PPR', 'PR')
            .orderBy('P.SPRNO', 'ASC')
            .getMany();
    }
}
