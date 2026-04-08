import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SearchAuditReportRevisionDto } from './dto/search-audit_report_revision.dto';
import { AUDIT_REPORT_REVISION } from 'src/common/Entities/escs/table/AUDIT_REPORT_REVISION.entity';
import { CreateAuditReportRevisionDto } from './dto/create-audit_report_revision.dto';

@Injectable()
export class AuditReportRevisionRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async getAuditReportRevision(dto: SearchAuditReportRevisionDto) {
        return this.getRepository(AUDIT_REPORT_REVISION).find({
            where: dto,
            order: { ARR_REV: dto.orderbyDirection || 'DESC' },
            relations: ['ARR_INCHARGE_INFO'],
        });
    }

    async findLatestRevision(
        secid: number,
    ): Promise<AUDIT_REPORT_REVISION | null> {
        return await this.getRepository(AUDIT_REPORT_REVISION).findOne({
            where: {
                ARR_SECID: secid,
            },
            order: {
                ARR_REV: 'DESC',
            },
        });
    }

    async insert(dto: CreateAuditReportRevisionDto){
        return await this.getRepository(AUDIT_REPORT_REVISION).insert(dto);
    }
}
