import { Injectable } from '@nestjs/common';
import { CreateESCSARMDto } from './dto/create-audit_report_master.dto';
import { UpdateESCSARMDto } from './dto/update-audit_report_master.dto';
import { SearchESCSARMDto } from './dto/search-audit_report_master.dto';
import { SaveESCSARMDto } from './dto/save-audit_report_master.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { AuditReportMaster } from './entities/audit_report_master.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { ESCSARRService } from '../audit_report_revision/audit_report_revision.service';
import { DataESCSARMDto } from './dto/data-audit_report_master.dto';
import { ESCSARHService } from '../audit_report_history/audit_report_history.service';
import { ESCSARMAService } from '../audit_report_master_all/audit_report_master_all.service';

@Injectable()
export class ESCSARMService {
  constructor(
    @InjectRepository(AuditReportMaster, 'amecConnection')
    private auditMasterRepo: Repository<AuditReportMaster>,
    @InjectDataSource('amecConnection')
    private readonly dataSource: DataSource,
    private readonly escsArrService: ESCSARRService,
    private readonly escsArhService: ESCSARHService,
    private readonly escsArmaService: ESCSARMAService,
  ) {}

  async getAuditReportMaster(dto: SearchESCSARMDto, queryRunner?: QueryRunner) {
    const repo = queryRunner ? queryRunner.manager : this.dataSource;
    const query = repo
      .createQueryBuilder()
      .from(AuditReportMaster, 'A')
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

  async saveEscsARM(dto: SaveESCSARMDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const { topic, list, incharge, reason, secid, total } = dto;
      const runner = queryRunner || localRunner!;
      const currentData = await this.getAuditReportMaster(
        { ARM_SECID: secid },
        runner,
      );
      console.log('currentData', currentData);

      const revision = await this.escsArrService.create(
        {
          ARR_SECID: secid,
          ARR_INCHARGE: incharge,
          ARR_REASON: reason,
          ARR_TOTAL: total
        },
        runner,
      );
      
      console.log('revision', revision);
      
      for (const row of currentData) {
        await this.escsArhService.create(
          {
            ARH_SECID: row.ARM_SECID,
            ARH_REV: row.ARM_REV,
            ARH_NO: row.ARM_NO,
            ARH_SEQ: row.ARM_SEQ,
            ARH_TYPE: row.ARM_TYPE,
            ARH_DETAIL: row.ARM_DETAIL,
            ARH_FACTOR: row.ARM_FACTOR,
            ARH_MAXSCORE: row.ARM_MAXSCORE,
            ARH_STATUS: row.ARM_STATUS,
          },
          runner,
        );
      }

      if (topic.length > 0) {
        for (const t of topic) {
          const data: any = await this.setData(t, revision.revision);
          data.ARM_TYPE = 'H';
          data.ARM_SEQ = 0;
          data.ARM_SECID = secid;
          if (t.type == 'del') {
            console.log('delete topic ', data);
            await this.delete(data, runner);
          } else if (t.type == 'edit') {
            console.log('update topic ', {
              ...data,
              condition: {
                ARM_REV: t.rev,
                ARM_NO: t.topic,
                ARM_SEQ: 0,
                ARM_TYPE: 'H',
              },
            });
            await this.update(
              {
                ...data,
                condition: {
                  ARM_REV: t.rev,
                  ARM_NO: t.topic,
                  ARM_SEQ: 0,
                  ARM_TYPE: 'H',
                },
              },
              runner,
            );
          } else {
            console.log('insert topic', data);
            await this.create(data, runner);
          }
        }
      }
      if (list.length > 0) {
        for (const l of list) {
          const data: any = await this.setData(l, revision.revision);
          data.ARM_TYPE = 'D';
          data.ARM_SECID = secid;
          if (l.type == 'del') {
            console.log('delete detail', data);
            await this.delete(data, runner);
          } else if (l.type == 'edit') {
            console.log('update detail ', {
              ...data,
              condition: {
                ARM_REV: l.rev,
                ARM_NO: l.topic,
                ARM_SEQ: l.seq,
                ARM_TYPE: 'D',
              },
            });

            await this.update(
              {
                ...data,
                condition: {
                  ARM_REV: l.rev,
                  ARM_NO: l.topic,
                  ARM_SEQ: l.seq,
                  ARM_TYPE: 'D',
                },
              },
              runner,
            );
          } else {
            console.log('insert detail', data);
            await this.create(data, runner);
          }
        }
      }
      await this.update(
        { ARM_REV: revision.revision, condition: { ARM_SECID: secid } },
        runner,
      );
      //   throw new Error('test error');
      if (localRunner) await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Save Successfully',
      };
    } catch (error) {
      if (localRunner) await localRunner.rollbackTransaction();
      throw new Error('Error: ' + error.message);
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async setData(dto: DataESCSARMDto, revision: number) {
    console.log('dto', dto);

    const {
      rev,
      detail,
      type,
      status,
      topic,
      new_topic,
      seq,
      new_seq,
      factor,
      maxScore,
    } = dto;
    if (type == 'new') {
      return {
        ARM_REV: revision,
        ARM_NO: new_topic || topic,
        ARM_SEQ: new_seq || seq,
        ARM_DETAIL: detail,
        ARM_FACTOR: factor ?? 0,
        ARM_MAXSCORE: maxScore ?? 3,
      };
    } else if (type == 'edit') {
      return {
        ARM_REV: revision,
        ARM_NO: new_topic || topic,
        ARM_SEQ: new_seq || seq,
        ARM_STATUS: status,
        ARM_DETAIL: detail,
        ARM_FACTOR: factor ?? 0,
        ARM_MAXSCORE: maxScore ?? 3,
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

      await runner.manager.insert(AuditReportMaster, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error(
        'Insert master Error: ' + error.message,
      );
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async update(dto: UpdateESCSARMDto, queryRunner?: QueryRunner) {
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
      const { condition, ...data } = dto;

      await runner.manager.update(AuditReportMaster, condition, data);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return { status: true, message: 'Update master Successfully' };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error(
        'Update master Error: ' + error.message,
      );
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
  async delete(dto: UpdateESCSARMDto, queryRunner?: QueryRunner) {
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

      await runner.manager.delete(AuditReportMaster, {
        ARM_REV: dto.ARM_REV,
        ARM_NO: dto.ARM_NO,
        ARM_SEQ: dto.ARM_SEQ,
        ARM_TYPE: dto.ARM_TYPE,
      });
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return { status: true, message: 'Delete master Successfully' };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error(
        'Delete master Error: ' + error.message,
      );
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
