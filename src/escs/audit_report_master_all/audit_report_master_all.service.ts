import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AuditReportMasterAll } from './entities/audit_report_master_all.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ESCSARRService } from '../audit_report_revision/audit_report_revision.service';
import { SearchESCSARMDto } from '../audit_report_master/dto/search-audit_report_master.dto';

@Injectable()
export class ESCSARMAService {
  constructor(
    @InjectRepository(AuditReportMasterAll, 'escsConnection')
    private auditMasterAllRepo: Repository<AuditReportMasterAll>,
    @InjectDataSource('escsConnection')
    private readonly dataSource: DataSource,
    private readonly escsArrService: ESCSARRService,
  ) {}

  async getAuditReportMaster(dto: SearchESCSARMDto, queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager : this.dataSource;

    const query = repo
      .createQueryBuilder()
      .from(AuditReportMasterAll, 'A')
      .orderBy('ARM_NO, ARM_SEQ', 'ASC');

    if (dto.ARM_REV !== undefined) {
      query.andWhere('ARM_REV = :rev', { rev: dto.ARM_REV });
    } else {
      const lastRevision = await this.escsArrService.findLatestRevision(
        dto.ARM_SECID,
        queryRunner,
      );
      if (lastRevision != null) {
        query.andWhere('ARM_REV = :rev', { rev: lastRevision.ARR_REV });
      }
    }
    if (dto.ARM_STATUS !== undefined) {
      query.andWhere('ARM_STATUS = :status', { status: dto.ARM_STATUS });
    }
    if (dto.ARM_SECID !== undefined) {
      query.andWhere('ARM_SECID = :secid', { secid: dto.ARM_SECID });
    }
    return await query.getRawMany();
  }
}
