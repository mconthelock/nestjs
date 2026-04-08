import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SearchOrgpoDto } from './dto/search-orgpo.dto';
import { ORGPOS } from 'src/common/Entities/webform/table/ORGPOS.entity';

@Injectable()
export class OrgposRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getOrgPos(dto: SearchOrgpoDto) {
        return this.getRepository(ORGPOS).find({
            where: dto,
            relations: ['EMPINFO'],
            order: {
                VEMPNO: 'ASC',
            },
        });
    }
}
