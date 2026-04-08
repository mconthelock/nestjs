import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { AUDIT_REPORT_MASTER } from 'src/common/Entities/escs/table/AUDIT_REPORT_MASTER.entity';
import { SearchAuditReportMasterDto } from './dto/search-audit_report_master.dto';
import { UpdateAuditReportMasterDto } from './dto/update-audit_report_master.dto';
import { CreateAuditReportMasterDto } from './dto/create-audit_report_master.dto';

@Injectable()
export class AuditReportMasterRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async find(dto: SearchAuditReportMasterDto) {
        return this.getRepository(AUDIT_REPORT_MASTER).find({
            where: dto,
            order: {
                ARM_NO: 'ASC',
                ARM_SEQ: 'ASC',
            },
        });
    }

    async insert(dto: CreateAuditReportMasterDto) {
        return this.getRepository(AUDIT_REPORT_MASTER).insert(dto);
    }

    async update(dto: UpdateAuditReportMasterDto) {
        const { condition, ...data } = dto;
        return this.getRepository(AUDIT_REPORT_MASTER).update(condition, data);
    }

    async delete(dto: UpdateAuditReportMasterDto) {
        return this.getRepository(AUDIT_REPORT_MASTER).delete({
            ARM_REV: dto.ARM_REV,
            ARM_NO: dto.ARM_NO,
            ARM_SEQ: dto.ARM_SEQ,
            ARM_TYPE: dto.ARM_TYPE,
        });
    }
}
