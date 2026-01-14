import { Injectable } from '@nestjs/common';
import { CreateEbgreqattfileDto } from './dto/create-ebgreqattfile.dto';
import { UpdateEbgreqattfileDto } from './dto/update-ebgreqattfile.dto';
import { EBGREQATTFILE } from 'src/common/Entities/ebudget/table/EBGREQATTFILE.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { SearchEbgreqattfileDto } from './dto/search-ebgreqattfile.dto';

@Injectable()
export class EbgreqattfileService {
  constructor(
    @InjectRepository(EBGREQATTFILE, 'ebudgetConnection')
    private readonly repo: Repository<EBGREQATTFILE>,
    @InjectDataSource('ebudgetConnection')
    private dataSource: DataSource,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findOne(dto: SearchEbgreqattfileDto, queryRunner?: QueryRunner) {
    const runner = queryRunner || this.dataSource.createQueryRunner();
    return runner.manager.findOne(EBGREQATTFILE, {
      where: dto,
    });
  }

  search(dto: SearchEbgreqattfileDto, queryRunner?: QueryRunner) {
    const runner = queryRunner || this.dataSource.createQueryRunner();
    return runner.manager.find(EBGREQATTFILE, {
      where: dto,
    });
  }

  async insert(dto: CreateEbgreqattfileDto, queryRunner?: QueryRunner) {
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

      const res = await runner.manager.insert(EBGREQATTFILE, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert EBGREQATTFILE Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert EBGREQATTFILE Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async update(dto: UpdateEbgreqattfileDto, queryRunner?: QueryRunner) {
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
      const { condition, ...updateData } = dto;
      const res = await runner.manager.update(
        EBGREQATTFILE,
        condition,
        updateData,
      );
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        data: res,
        message: 'Update EBGREQATTFILE Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Update EBGREQATTFILE Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async delete(dto: UpdateEbgreqattfileDto, queryRunner?: QueryRunner) {
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
      await runner.manager.delete(EBGREQATTFILE, dto.condition);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Delete EBGREQATTFILE Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Delete EBGREQATTFILE Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
