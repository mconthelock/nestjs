import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { SearchAuditReportMasterDto } from '../audit_report_master/dto/search-audit_report_master.dto';
import { AUDIT_REPORT_MASTER_ALL } from 'src/common/Entities/escs/views/AUDIT_REPORT_MASTER_ALL.entity';

@Injectable()
export class AuditReportMasterAllRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async find(dto: SearchAuditReportMasterDto) {
        return this.getRepository(AUDIT_REPORT_MASTER_ALL).find({
            where: dto,
            order: {
                ARM_NO: 'ASC',
                ARM_SEQ: 'ASC',
            },
        });
    }
}
