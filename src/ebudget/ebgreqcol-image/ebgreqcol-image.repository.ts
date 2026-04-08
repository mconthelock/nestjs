import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { EBGREQCOL_IMAGE } from 'src/common/Entities/ebudget/table/EBGREQCOL_IMAGE.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { SearchEbgreqcolImageDto } from './dto/search-ebgreqcol-image.dto';
import { CreateEbgreqcolImageDto } from './dto/create-ebgreqcol-image.dto';
import { UpdateEbgreqcolImageDto } from './dto/update-ebgreqcol-image.dto';
@Injectable({ scope: Scope.REQUEST })
export class EbgreqcolImageRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(EBGREQCOL_IMAGE).find();
    }

    findOne(dto: SearchEbgreqcolImageDto) {
        return this.getRepository(EBGREQCOL_IMAGE).findOne({
            where: dto,
        });
    }

    find(dto: SearchEbgreqcolImageDto) {
        return this.getRepository(EBGREQCOL_IMAGE).find({
            where: dto,
        });
    }

    async insert(dto: CreateEbgreqcolImageDto) {
        return await this.getRepository(EBGREQCOL_IMAGE).insert(dto);
    }

    async update(dto: UpdateEbgreqcolImageDto) {
        const { condition, ...updateData } = dto;
        return await this.getRepository(EBGREQCOL_IMAGE).update(
            condition,
            updateData,
        );
    }

    async delete(dto: UpdateEbgreqcolImageDto) {
        return await this.getRepository(EBGREQCOL_IMAGE).delete(dto.condition);
    }
}
