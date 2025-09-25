import { Injectable } from '@nestjs/common';
import { CreateESCSARHDto } from './dto/create-audit_report_history.dto';
import { UpdateESCSARHDto } from './dto/update-audit_report_history.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AuditReportHistory } from './entities/audit_report_history.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ESCSARHService {
  constructor(
    @InjectRepository(AuditReportHistory, 'amecConnection')
    private readonly eSCSARHRepository: Repository<AuditReportHistory>,
    @InjectDataSource('amecConnection')
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateESCSARHDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    let didConnect = false;
    let didStartTx = false;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        didConnect = true;
        await localRunner.startTransaction();
        didStartTx = true;
      }
      const runner = queryRunner || localRunner!;
      await runner.manager.insert(AuditReportHistory, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert history Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
