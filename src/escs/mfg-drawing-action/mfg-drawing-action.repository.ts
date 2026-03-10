import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { MFG_DRAWING_ACTION } from 'src/common/Entities/escs/table/MFG_DRAWING_ACTION.entity';
import { UpdateMfgDrawingActionDto } from './dto/update-mfg-drawing-action.dto';
import { CreateMfgDrawingActionDto } from './dto/create-mfg-drawing-action.dto';

@Injectable()
export class MfgDrawingActionRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateMfgDrawingActionDto) {
        return this.getRepository(MFG_DRAWING_ACTION).save(dto);
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from MFG_DRAWING_ACTION`);
        // return this.getRepository(MFG_DRAWING_ACTION).find();
        return this.manager.find(MFG_DRAWING_ACTION);
    }

    findOne(id: number) {
        return this.getRepository(MFG_DRAWING_ACTION).findOne({
            where: { NDRAWINGID: id },
            relations: ['DRAWING'],
            order: { DACTDATE: 'ASC' },
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(MFG_DRAWING_ACTION, 'M');
        this.applyFilters(qb, 'M', dto, [
            'NDRAWINGID',
            'NACTION',
            'NUSERACT',
            'DACTDATE',
            'NSTATUS',
        ]);
        return qb
            .leftJoinAndSelect('M.DRAWING', 'D')
            .orderBy('M.DACTDATE', 'ASC')
            .getMany();
    }

    async update(id: number, dto: UpdateMfgDrawingActionDto) {
        return this.getRepository(MFG_DRAWING_ACTION).update({ NDRAWINGID: id }, dto);
    }

    async remove(id: number) {
        return this.getRepository(MFG_DRAWING_ACTION).delete({ NDRAWINGID: id });
    }
}
