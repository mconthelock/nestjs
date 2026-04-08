import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SearchIsFileDto } from './dto/search-is-file.dto';
import { IS_FILE } from 'src/common/Entities/webform/table/IS_FILE.entity';
import { CreateIsFileDto } from './dto/create-is-file.dto';

@Injectable()
export class IsFileRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getFile(dto: SearchIsFileDto) {
        return this.getRepository(IS_FILE).find({
            where: dto,
            order: {
                FILE_ID: 'ASC',
            },
        });
    }

    async getNextSeq(dto: SearchIsFileDto) {
        return this.getRepository(IS_FILE).find({
            where: dto,
            order: {
                FILE_ID: 'DESC',
            },
            take: 1,
        });
    }

    async insert(dto: CreateIsFileDto) {
        return await this.getRepository(IS_FILE).insert(dto);
    }
}
