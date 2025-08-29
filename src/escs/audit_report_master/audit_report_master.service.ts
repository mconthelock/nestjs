import { Injectable } from '@nestjs/common';
import { CreateESCSARMDto } from './dto/create-audit_report_master.dto';
import { UpdateESCSARMDto } from './dto/update-audit_report_master.dto';
import { SearchESCSARMDto } from './dto/search-audit_report_master.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { AuditReportMaster } from './entities/audit_report_master.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { ESCSARRService } from '../audit_report_revision/audit_report_revision.service';

@Injectable()
export class ESCSARMService {
  constructor(
    @InjectRepository(AuditReportMaster, 'amecConnection')
    private auditMasterRepo: Repository<AuditReportMaster>,
    @InjectDataSource('amecConnection')
    private readonly dataSource: DataSource,
    private readonly escsArrService: ESCSARRService,
  ) {}

  async getAuditReportMaster(dto: SearchESCSARMDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager
      : this.dataSource;
    const lastRevision = await this.escsArrService.findLatestRevision(queryRunner);
    const rev = dto.ARM_REV ?? lastRevision.ARR_REV;
    console.log(rev);
    
    return await repo.createQueryBuilder()
    .select('ARR_REV_TEXT, B.*, C.ARM_DETAIL, C.ARM_TYPE, C.ARM_STATUS, ARR_CREATEDATE, ARR_INCHARGE, ARR_REASON')
    .from('AUDIT_REPORT_REVISION', 'A')
    .innerJoin(
        q => q
            .subQuery()
            .select('MAX(ARR_REV) AS ARM_REV, ARM_NO, ARM_SEQ')
            .from('AUDIT_REPORT_REVISION', 'SUBREV')
            .innerJoin('AUDIT_REPORT_MASTER', 'SUBMAS', 'SUBREV.ARR_REV = SUBMAS.ARM_REV')
            .where('ARM_STATUS = 1')
            .andWhere('ARM_REV <= :rev', { rev })
            .groupBy('ARM_NO, ARM_SEQ')
        , 'B', 'A.ARR_REV = B.ARM_REV'
    )
    .innerJoin(
        q => q
            .subQuery()
            .from('AUDIT_REPORT_MASTER', 'C')
        , 'C', 'B.ARM_REV = C.ARM_REV  AND B.ARM_NO = C.ARM_NO AND B.ARM_SEQ = C.ARM_SEQ'
    )
    .orderBy('B.ARM_NO, B.ARM_SEQ', 'ASC')
    .getRawMany();
  }
}
