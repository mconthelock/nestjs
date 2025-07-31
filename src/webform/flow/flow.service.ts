import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';

import { Flow } from './entities/flow.entity';
import { Flowts } from './entities/flowts.entity';

import { getExtDataDto } from './dto/get-Extdata.dto';
import { SearchFlowDto } from './dto/search-flow.dto';
import { setRepo } from 'src/utils/repo';
import { CreateFlowDto } from './dto/create-flow.dto';
import { UpdateFlowDto } from './dto/update-flow.dto';
import { Query } from 'mysql2/typings/mysql/lib/protocol/sequences/Query';

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(Flow, 'amecConnection')
    private readonly flowRepo: Repository<Flow>,
    @InjectRepository(Flowts, 'amecConnection')
    private readonly flowtsRepo: Repository<Flowts>,

    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}
  private readonly STEP_READY = '3';

  getExtData(dto: getExtDataDto, host: string) {
    const repo = setRepo(this.flowRepo, this.flowtsRepo, host);
    const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, APV } = dto;

    return repo
      .createQueryBuilder('f')
      .select('CEXTDATA')
      .where('f.NFRMNO = :NFRMNO', { NFRMNO })
      .andWhere('f.VORGNO = :VORGNO', { VORGNO })
      .andWhere('f.CYEAR = :CYEAR', { CYEAR })
      .andWhere('f.CYEAR2 = :CYEAR2', { CYEAR2 })
      .andWhere('f.NRUNNO = :NRUNNO', { NRUNNO })
      .andWhere('(f.VAPVNO = :APV OR f.VREPNO = :REP)', { APV, REP: APV })
      .andWhere('f.CSTEPST = :STEP_READY', { STEP_READY: '3' })
      .getRawMany();
  }

  async insertFlow(
    dto: CreateFlowDto,
    host: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repo = setRepo(this.flowRepo, this.flowtsRepo, host);
    // console.log('insert flow data : ', dto);
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      await runner.manager.save(repo.target, dto);
      if (localRunner) await localRunner.commitTransaction();
      //   await this.repo.save(formData);
    //   console.log('-----------------Flow inserted successfully------------------');
      
      return true;
    } catch (error) {
      console.error('Error inserting flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
    //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  getFlow(dto: SearchFlowDto, host: string, queryRunner?: QueryRunner) {
    const repo = setRepo(this.flowRepo, this.flowtsRepo, host);
    // console.log('get flow data : ', dto);
    if (queryRunner) {
      return queryRunner.manager.getRepository(repo.target).find({
        where: dto,
      });
    }
    
    return repo.find({
      where: dto,
    });
  }

  async updateFlow(
    dto: UpdateFlowDto,
    host: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repo = setRepo(this.flowRepo, this.flowtsRepo, host);
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      const { condition, ...data } = dto;

      // await queryRunner.manager.save(repo.target, dto);
      await runner.manager.getRepository(repo.target).update(condition, data);

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error('Error update flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
      //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async reAlignFlow(
    dto: UpdateFlowDto,
    host: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repo = setRepo(this.flowRepo, this.flowtsRepo, host);
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;

      await runner.manager
        .getRepository(repo.target)
        .createQueryBuilder()
        .update()
        .set({ CSTEPST: () => 'CSTEPST - 1' })
        .where(dto)
        .andWhere('CSTEPST > 1')
        .andWhere('CSTEPST < 5')
        .execute();

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error('Error re-aligning flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
    //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async deleteFlow(
    dto: UpdateFlowDto,
    host: string,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const repo = setRepo(this.flowRepo, this.flowtsRepo, host);
    let localRunner: QueryRunner | undefined;
    console.log('delete flow data : ', dto);
    
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;
      await runner.manager.getRepository(repo.target).delete(dto);

      if (localRunner) await localRunner.commitTransaction();
      return true;
    } catch (error) {
      console.error('Error deleting flow:', error);
      if (localRunner) await localRunner.rollbackTransaction();
      throw error;
    //   return false;
    } finally {
      if (localRunner) await localRunner.release();
    }
  }
}
