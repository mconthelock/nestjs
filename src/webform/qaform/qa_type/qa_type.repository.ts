import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { QA_TYPE } from 'src/common/Entities/webform/table/QA_TYPE.entity';

@Injectable()
export class QaTypeRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll(){
        return this.getRepository(QA_TYPE).find();
    }

    findOneByCode(code: string){
        return this.getRepository(QA_TYPE).findOne({ where: { QAT_CODE: code } });
    }
}
