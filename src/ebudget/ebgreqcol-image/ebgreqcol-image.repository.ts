import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { EBGREQCOL_IMAGE } from 'src/common/Entities/ebudget/table/EBGREQCOL_IMAGE.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { SearchEbgreqcolImageDto } from './dto/search-ebgreqcol-image.dto';
import { CreateEbgreqcolImageDto } from './dto/create-ebgreqcol-image.dto';
import { UpdateEbgreqcolImageDto } from './dto/update-ebgreqcol-image.dto';
@Injectable()
export class EbgreqcolImageRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
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
