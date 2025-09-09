import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateESCSARRDto } from './dto/create-audit_report_revision.dto';
import { UpdateESCSARRDto } from './dto/update-audit_report_revision.dto';
import { SearchESCSARRDto } from './dto/search-audit_report_revision.dto';
import { AuditReportRevision } from './entities/audit_report_revision.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';

@Injectable()
export class ESCSARRService {
  constructor(
    @InjectRepository(AuditReportRevision, 'amecConnection')
    private auditRepo: Repository<AuditReportRevision>,
    @InjectDataSource('amecConnection')
    private readonly dataSource: DataSource,
  ) {}

  async getAuditReportRevision(
    dto: SearchESCSARRDto,
    queryRunner?: QueryRunner,
  ) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(AuditReportRevision)
      : this.auditRepo;
    return repo.find({
      where: dto,
      order: { ARR_REV: dto.orderbyDirection || 'DESC' },
      relations: ['ARR_INCHARGE_INFO'],
    });
  }

  async findLatestRevision(
    queryRunner?: QueryRunner,
  ): Promise<AuditReportRevision | null> {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(AuditReportRevision)
      : this.auditRepo;
    return await repo.findOne({
      where: {},
      order: {
        ARR_REV: 'DESC',
      },
    });
  }

  async getNextRevision(queryRunner?: QueryRunner): Promise<number> {
    const lastRevision = await this.findLatestRevision(queryRunner);
    return lastRevision ? lastRevision.ARR_REV + 1 : 1;
  }

  async create(dto: CreateESCSARRDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      const revision = await this.getNextRevision(runner);
      const data = {
        ARR_REV: revision,
        ARR_REV_TEXT: numberToAlphabetRevision(revision),
        ...dto,
      };

      await runner.manager.insert(AuditReportRevision, data);
      if (localRunner) await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Save Successfully',
        revision: revision,
      };
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Insert revision Error: ' + error.message,
      );
    } finally {
      if (localRunner) await localRunner.release();
    }
  }
}
