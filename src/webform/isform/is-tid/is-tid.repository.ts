import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ISTID_FORM } from 'src/common/Entities/webform/table/ISTID_FORM.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { UpdateIsTidDto } from './dto/update-is-tid.dto';
import { CreateIsTidDto, CreateIsTidFormDto } from './dto/create-is-tid.dto';

@Injectable()
export class IsTidRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from ISTID_FORM`);
        // return this.getRepository(ISTID_FORM).find();
        return this.manager.find(ISTID_FORM);
    }

    findOne(dto: FormDto) {
        return this.getRepository(ISTID_FORM).findOne({
            where: dto,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(ISTID_FORM, 'M');
        this.applyFilters(qb, 'I', dto, ['CYEAR2', 'NRUNNO']);
        return qb.getMany();
    }

    async create(dto: CreateIsTidDto) {
        return this.getRepository(ISTID_FORM).save(dto);
    }

    async update(form: FormDto, dto: UpdateIsTidDto) {
        return this.getRepository(ISTID_FORM).update(form, dto);
    }

    async remove(form: FormDto) {
        return this.getRepository(ISTID_FORM).delete(form);
    }
}
