import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateQainsAuditDto,
  saveQainsAuditDto,
} from './dto/create-qains_audit.dto';
import { UpdateQainsAuditDto } from './dto/update-qains_audit.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { QainsAudit } from './entities/qains_audit.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { QainsOAService } from '../qains_operator_auditor/qains_operator_auditor.service';

@Injectable()
export class QainsAuditService {
  constructor(
    @InjectRepository(QainsAudit, 'amecConnection')
    private auditRepo: Repository<QainsAudit>,
    @InjectDataSource('amecConnection')
    private readonly dataSource: DataSource,
    private readonly qainsOAService: QainsOAService,
  ) {}

  async saveAudit(dto: saveQainsAuditDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const form = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
      };

      // delete old records
      await this.delete(
        {
          ...form,
          QAA_TYPECODE: dto.typecode,
          QAA_AUDIT_SEQ: dto.auditSeq,
        },
        queryRunner,
      );

      // insert new records
      for (const d of dto.data) {
        await this.create(d, queryRunner);
      }

      // update QainsOA
      if (!dto.draft) {
        await this.qainsOAService.update({
          ...form,
          QOA_TYPECODE: 'ESO',
          QOA_SEQ: dto.auditSeq,
          QOA_AUDIT: 1,
          QOA_RESULT: dto.res,
          QOA_SCORE: dto.score,
          QOA_GRADE: dto.grade,
        }, queryRunner);
      }
      await queryRunner.commitTransaction();
      return dto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async create(dto: CreateQainsAuditDto, queryRunner?: QueryRunner) {
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

      await runner.manager.insert(QainsAudit, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert audit Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert audit ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async delete(dto: UpdateQainsAuditDto, queryRunner?: QueryRunner) {
    console.log(dto);

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

      await runner.manager.delete(QainsAudit, {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        QAA_TYPECODE: dto.QAA_TYPECODE,
        QAA_AUDIT_SEQ: dto.QAA_AUDIT_SEQ,
        // QAA_TOPIC: dto.QAA_TOPIC,
        // QAA_SEQ: dto.QAA_SEQ,
      });
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return { status: true, message: 'Delete master Successfully' };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Delete master Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
