import { Injectable } from '@nestjs/common';
import { CreateESCSARRDto } from './dto/create-audit_report_revision.dto';
import { UpdateESCSARRDto } from './dto/update-audit_report_revision.dto';
import { SearchESCSARRDto } from './dto/search-audit_report_revision.dto';
import { AuditReportRevision } from './entities/audit_report_revision.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ESCSARRService {
  constructor(
    @InjectRepository(AuditReportRevision, 'amecConnection')
    private auditRepo: Repository<AuditReportRevision>,
  ) {}

  async getRevision(dto: SearchESCSARRDto, queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager.getRepository(AuditReportRevision) : this.auditRepo;
    return repo.find({where: dto, order: { ARR_REV: 'ASC' }, relations: ['ARR_INCHARGE_INFO']});
  }
}
