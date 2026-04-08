import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { REP } from 'src/common/Entities/webform/table/REP.entity';
import { SearchRepDto } from './dto/search-rep.dto';

@Injectable()
export class RepRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getRep(dto: SearchRepDto) {
        return this.getRepository(REP).find({ where: dto });
    }
}
