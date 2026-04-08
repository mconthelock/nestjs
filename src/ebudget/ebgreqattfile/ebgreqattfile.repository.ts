import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { EBGREQATTFILE } from 'src/common/Entities/ebudget/table/EBGREQATTFILE.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { SearchEbgreqattfileDto } from './dto/search-ebgreqattfile.dto';
import { UpdateEbgreqattfileDto } from './dto/update-ebgreqattfile.dto';
import { CreateEbgreqattfileDto } from './dto/create-ebgreqattfile.dto';
@Injectable()
export class EbgreqattfileRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(EBGREQATTFILE).find();
    }

    findOne(dto: SearchEbgreqattfileDto) {
        return this.getRepository(EBGREQATTFILE).findOne({
            where: dto,
        });
    }

    find(dto: SearchEbgreqattfileDto) {
        return this.getRepository(EBGREQATTFILE).find({
            where: dto,
        });
    }

    async insert(dto: CreateEbgreqattfileDto) {
        return await this.getRepository(EBGREQATTFILE).insert(dto);
    }

    async update(dto: UpdateEbgreqattfileDto) {
        const { condition, ...updateData } = dto;
        return await this.getRepository(EBGREQATTFILE).update(
            condition,
            updateData,
        );
    }

    async delete(dto: UpdateEbgreqattfileDto) {
        return await this.getRepository(EBGREQATTFILE).delete(dto.condition);
    }
}
