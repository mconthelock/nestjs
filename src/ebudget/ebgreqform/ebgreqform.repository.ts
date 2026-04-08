import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { EBGREQFORM } from 'src/common/Entities/ebudget/table/EBGREQFORM.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { DataSource } from 'typeorm';
import { CreateEbgreqformDto } from './dto/create-ebgreqform.dto';

@Injectable({ scope: Scope.REQUEST })
export class EbgreqformRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findOne(form: FormDto) {
        return this.getRepository(EBGREQFORM).findOneBy(form);
    }

    async create(dto: CreateEbgreqformDto) {
        return this.getRepository(EBGREQFORM).save(dto);
    }
}
