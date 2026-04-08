import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InsertIsCfDto } from './dto/create-is-cf.dto';
import { ISCFS_FORM } from 'src/common/Entities/webform/table/ISCFS_FORM.entity';

@Injectable()
export class IsCfsRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: InsertIsCfDto) {
        return this.getRepository(ISCFS_FORM).save(dto);
    }
}
