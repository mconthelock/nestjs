import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SearchQaFileDto } from './dto/search-qa_file.dto';
import { QA_FILE } from 'src/common/Entities/webform/table/QA_FILE.entity';
import { CreateQaFileDto } from './dto/create-qa_file.dto';

@Injectable()
export class QaFileRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getQaFile(dto: SearchQaFileDto) {
        return this.getRepository(QA_FILE).find({
            where: dto,
            order: {
                FILE_ID: 'ASC',
            },
        });
    }

    async getQaFileByID(dto: SearchQaFileDto) {
        return this.getRepository(QA_FILE).findOne({
            where: {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: dto.CYEAR2,
                NRUNNO: dto.NRUNNO,
                FILE_TYPECODE: dto.FILE_TYPECODE,
                FILE_ID: dto.FILE_ID,
            },
            order: {
                FILE_ID: 'ASC',
            },
        });
    }

    async getNextSeq(dto: SearchQaFileDto) {
        return this.getRepository(QA_FILE).find({
            where: dto,
            order: {
                FILE_ID: 'DESC',
            },
            take: 1,
        });
    }

    async insert(dto: CreateQaFileDto) {
        return this.getRepository(QA_FILE).insert(dto);
    }

    async delete(dto: SearchQaFileDto) {
        return this.getRepository(QA_FILE).delete(dto);
    }
}
