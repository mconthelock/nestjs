import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateESCSARMDto } from './dto/create-audit_report_master.dto';
import { UpdateESCSARMDto } from './dto/update-audit_report_master.dto';
import { SearchESCSARMDto } from './dto/search-audit_report_master.dto';
import { SaveESCSARMDto } from './dto/save-audit_report_master.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { AuditReportMaster } from './entities/audit_report_master.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { ESCSARRService } from '../audit_report_revision/audit_report_revision.service';
import { numberToAlphabetRevision } from 'src/common/utils/format.utils';
import { DataESCSARMDto } from './dto/data-audit_report_master.dto';

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
    const repo = queryRunner ? queryRunner.manager : this.dataSource;
    const lastRevision =
      await this.escsArrService.findLatestRevision(queryRunner);
    const rev = dto.ARM_REV ?? lastRevision.ARR_REV;
    console.log(rev);

    return await repo.createQueryBuilder()
      .select('ARM_REV, ARM_NO, ARM_SEQ, ARM_DETAIL, ARM_TYPE, ARM_STATUS, ARM_FACTOR, ARM_MAXSCORE')
      .from(AuditReportMaster, 'A')
      .where('ARM_REV <= :rev', { rev })
      .orderBy('ARM_NO, ARM_SEQ', 'ASC')
      .getRawMany();
    

    return await repo
      .createQueryBuilder()
      .select(
        'ARR_REV_TEXT, B.*, C.ARM_DETAIL, C.ARM_TYPE, C.ARM_STATUS, ARR_CREATEDATE, ARR_INCHARGE, ARR_REASON',
      )
      .from('AUDIT_REPORT_REVISION', 'A')
      .innerJoin(
        (q) =>
          q
            .subQuery()
            .select('MAX(ARR_REV) AS ARM_REV, ARM_NO, ARM_SEQ')
            .from('AUDIT_REPORT_REVISION', 'SUBREV')
            .innerJoin(
              'AUDIT_REPORT_MASTER',
              'SUBMAS',
              'SUBREV.ARR_REV = SUBMAS.ARM_REV',
            )
            .where('ARM_REV <= :rev', { rev })
            .groupBy('ARM_NO, ARM_SEQ'),
        'B',
        'A.ARR_REV = B.ARM_REV',
      )
      .innerJoin(
        (q) => q.subQuery().from('AUDIT_REPORT_MASTER', 'C'),
        'C',
        'B.ARM_REV = C.ARM_REV  AND B.ARM_NO = C.ARM_NO AND B.ARM_SEQ = C.ARM_SEQ',
      )
      //   .where('ARM_STATUS in (0, 1)')
      .orderBy('B.ARM_NO, B.ARM_SEQ', 'ASC')
      .getRawMany();
  }

  async saveEscsARM(dto: SaveESCSARMDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const { topic, list, incharge, reason } = dto;
      const runner = queryRunner || localRunner!;
      const revision = await this.escsArrService.create(
        {
          ARR_INCHARGE: incharge,
          ARR_REASON: reason,
        },
        runner,
      );
      if (topic.length > 0) {
        for (const t of topic) {
          const data: any = await this.setData(t, revision.revision);
          data.ARM_TYPE = 'H';
          data.ARM_SEQ = 0;
          if (t.type == 'del') {
              console.log('delete topic ',data);
            await this.delete(data, runner);
        } else if (t.type == 'edit') {
              console.log('update topic ',{...data, condition: { ARM_REV: t.rev, ARM_NO: t.topic, ARM_SEQ: 0, ARM_TYPE: 'H' } });
            await this.update({...data, condition: { ARM_REV: t.rev, ARM_NO: t.topic, ARM_SEQ: 0, ARM_TYPE: 'H' } }, runner);
          } else {
              console.log('insert topic',data);
            await this.create(data, runner);
          }
        }
      }
      if (list.length > 0) {
        for (const l of list) {
          const data: any = await this.setData(l, revision.revision);
          data.ARM_TYPE = 'D';
          
          if (l.type == 'del') {
              console.log('delete detail',data);
            await this.delete(data, runner);
          } else if (l.type == 'edit') {
              console.log('update detail ',{...data, condition: { ARM_REV: l.rev, ARM_NO: l.topic, ARM_SEQ: l.seq, ARM_TYPE: 'D' } });
            
            await this.update({...data, condition: { ARM_REV: l.rev, ARM_NO: l.topic, ARM_SEQ: l.seq, ARM_TYPE: 'D' } }, runner);
          } else {
              console.log('insert detail',data);
            await this.create(data, runner);
          }
        }
      }
      throw new Error('test error');
      if (localRunner) await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Save Successfully',
      };
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error: ' + error.message);
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async setData(dto: DataESCSARMDto, revision: number) {
    const { rev, detail, type, status, topic, new_topic, seq, new_seq, factor, maxScore } = dto;
    if (type == 'new') {
      return {
        ARM_REV: revision,
        ARM_NO: new_topic || topic,
        ARM_SEQ: new_seq || seq,
        ARM_DETAIL: detail,
        ARM_FACTOR: factor || 0,
        ARM_MAXSCORE: maxScore || 3
    };
} else if (type == 'edit') {
    return {
        ARM_REV: revision,
        ARM_NO: new_topic || topic,
        ARM_SEQ: new_seq || seq,
        ARM_STATUS: status,
        ARM_DETAIL: detail,
        ARM_FACTOR: factor || 0,
        ARM_MAXSCORE: maxScore || 3
      };
    } else if (type == 'del') {
      return {
        ARM_REV: rev,
        ARM_NO: topic,
        ARM_SEQ: seq,
      };
    }
  }

  async create(dto: CreateESCSARMDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;

      await runner.manager.insert(AuditReportMaster, dto);
      if (localRunner) await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert Successfully',
      };
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Insert master Error: ' + error.message,
      );
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async update(dto: UpdateESCSARMDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      const {condition, ...data} = dto;

      await runner.manager.update(
        AuditReportMaster,
        condition,
        data,
      );
      if (localRunner) await localRunner.commitTransaction();
      return { status: true, message: 'Update master Successfully' };
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Update master Error: ' + error.message,
      );
    } finally {
      if (localRunner) await localRunner.release();
    }
  }
  async delete(dto: UpdateESCSARMDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;

      await runner.manager.delete(AuditReportMaster, {
        ARM_REV: dto.ARM_REV,
        ARM_NO: dto.ARM_NO,
        ARM_SEQ: dto.ARM_SEQ,
        ARM_TYPE: dto.ARM_TYPE,
      });
      if (localRunner) await localRunner.commitTransaction();
      return { status: true, message: 'Delete master Successfully' };
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Delete master Error: ' + error.message,
      );
    } finally {
      if (localRunner) await localRunner.release();
    }
  }
}
