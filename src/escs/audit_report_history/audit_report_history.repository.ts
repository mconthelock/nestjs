import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AUDIT_REPORT_HISTORY } from 'src/common/Entities/escs/table/AUDIT_REPORT_HISTORY.entity';
import { CreateAuditReportHistoryDto } from './dto/create-audit_report_history.dto';

@Injectable()
export class AuditReportHistoryRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async insert(dto: CreateAuditReportHistoryDto) {
        return await this.manager.insert(AUDIT_REPORT_HISTORY, dto);
    }
}
