import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateQainsOADto } from './dto/create-qains_operator_auditor.dto';
import { SearchQainsOADto } from './dto/search-qains_operator_auditor.dto';
import { UpdateQainsOADto } from './dto/update-qains_operator_auditor.dto';
import { QainsOA } from './entities/qains_operator_auditor.entity';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Injectable()
export class QainsOAService {
  constructor(
    @InjectRepository(QainsOA, 'amecConnection')
    private readonly qainsOARepo: Repository<QainsOA>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}
  async createQainsOA(dto: CreateQainsOADto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;

      const condition = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        QOA_TYPECODE: dto.QOA_TYPECODE,
      };
      const maxSeq = await this.setSeq(condition, runner);
      const data = {
        ...condition,
        QOA_SEQ: maxSeq,
        QOA_EMPNO: dto.QOA_EMPNO,
      };

      await runner.manager.save(QainsOA, data);

      if (localRunner) await localRunner.commitTransaction();
      return { status: true, message: 'Inserted Successfully' };
    } catch (error) {
      if (localRunner) {
        await localRunner.rollbackTransaction();
        return { status: false, message: 'Error: ' + error.message };
      } else {
        throw error;
      }
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async setSeq(dto: SearchQainsOADto, queryRunner?: QueryRunner) {
    const lastSeq = queryRunner
      ? await this.getNextSeq(dto, queryRunner)
      : await this.getNextSeq(dto);
    if (lastSeq.length > 0) {
      return lastSeq[0].QOA_SEQ + 1;
    } else {
      return 1;
    }
  }

  async getNextSeq(dto: SearchQainsOADto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsOA)
      : this.qainsOARepo;
    return repo.find({
      where: dto,
      order: {
        QOA_SEQ: 'DESC',
      },
      take: 1,
    });
  }

  async searchQainsOA(dto: SearchQainsOADto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsOA)
      : this.qainsOARepo;
    return repo.find({
      where: dto,
      relations: [
        'QA_AUDIT',
        'QOA_EMPNO_INFO',
        'QA_FILES'
      ],
      order: {
        QOA_SEQ: 'ASC',
      },
    });
  }

  async findOne(dto: SearchQainsOADto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsOA)
      : this.qainsOARepo;
    return repo.findOne({
      where: dto,
      relations: [
        'QA_AUDIT',
        'QOA_EMPNO_INFO',
        'QA_FILES'
      ],
      order: {
        QOA_SEQ: 'ASC',
      },
    });
  }

  async delete(dto: CreateQainsOADto, queryRunner?: QueryRunner) {
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

      await runner.manager.delete(QainsOA, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Delete Qains operator and auditor Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Delete Qains operator and auditor ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async update(dto: UpdateQainsOADto, queryRunner?: QueryRunner) {
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

      const condition = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        QOA_TYPECODE: dto.QOA_TYPECODE,
        QOA_SEQ: dto.QOA_SEQ,
      };

      const data = {
        QOA_AUDIT: dto.QOA_AUDIT,
        QOA_RESULT: dto.QOA_RESULT,
        QOA_PERCENT: dto.QOA_PERCENT,
        QOA_GRADE: dto.QOA_GRADE,
        QOA_AUDIT_RESULT: dto.QOA_AUDIT_RESULT,
        QOA_IMPROVMENT_ACTIVITY: dto.QOA_IMPROVMENT_ACTIVITY,
        QOA_STATION: dto.QOA_STATION,
        QOA_SCORE: dto.QOA_SCORE,
      };

      await runner.manager.update(QainsOA, condition, data);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Update Qains operator and auditor Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Update Qains operator and auditor ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async checkAuditSuccess(dto: FormDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsOA)
      : this.qainsOARepo;
    const count = await repo.createQueryBuilder('A')
    .select("CASE WHEN SUM(CASE WHEN QOA_AUDIT = 1 THEN 1 ELSE 0 END) = COUNT(*) THEN 1 ELSE 0 END AS RES")
    .where("A.NFRMNO = :NFRMNO", { NFRMNO: dto.NFRMNO })
    .andWhere("A.VORGNO = :VORGNO", { VORGNO: dto.VORGNO })
    .andWhere("A.CYEAR = :CYEAR", { CYEAR: dto.CYEAR })
    .andWhere("A.CYEAR2 = :CYEAR2", { CYEAR2: dto.CYEAR2 })
    .andWhere("A.NRUNNO = :NRUNNO", { NRUNNO: dto.NRUNNO })
    .andWhere("A.QOA_TYPECODE = :QOA_TYPECODE", { QOA_TYPECODE: 'ESO' })
    .getRawOne();
    return count.RES;
}
}
