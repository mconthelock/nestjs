import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateQainsOADto } from './dto/create-qains_operator_auditor.dto';
import { SearchQainsOADto } from './dto/search-qains_operator_auditor.dto';
import { UpdateQainsOADto } from './dto/update-qains_operator_auditor.dto';
import { QainsOA } from './entities/qains_operator_auditor.entity';

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

      console.log('maxSeq',maxSeq);
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

  async searchQainsOA(dto: SearchQainsOADto) {
    return this.qainsOARepo.find({ where: dto });
  }

  async delete(dto: CreateQainsOADto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QainsOA)
      : this.qainsOARepo;
    return repo.delete(dto);
  }
}
