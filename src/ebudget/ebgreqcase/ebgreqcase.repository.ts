import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { EBGREQCASE } from 'src/common/Entities/ebudget/table/EBGREQCASE.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
@Injectable({ scope: Scope.REQUEST })
export class EbgreqcaseRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(EBGREQCASE).find();
    }

    findOne(id: number) {
        return this.getRepository(EBGREQCASE).findOneBy({ ID: id });
    }
}
