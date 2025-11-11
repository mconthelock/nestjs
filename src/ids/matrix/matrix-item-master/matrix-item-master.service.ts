import { Injectable } from '@nestjs/common';
import {
  CreateMatrixItemMasterDto,
  MigrationMatrixItemMasterDto,
} from './dto/create-matrix-item-master.dto';
import { getMatrixItemMasterDto, UpdateMatrixItemMasterDto } from './dto/update-matrix-item-master.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { MatrixItemMaster } from './entities/matrix-item-master.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MatrixItemMasterService {
  constructor(
    @InjectRepository(MatrixItemMaster, 'idsConnection')
    private readonly mtxRepo: Repository<MatrixItemMaster>,
    @InjectDataSource('idsConnection')
    private readonly dataSource: DataSource,
  ) {}

  async getMaster(dto: getMatrixItemMasterDto) {
    return await this.mtxRepo.find({
      where: {
        ID: dto.ID,
        ITEMNO: dto.ITEMNO,
        SECID: dto.SECID,
        TITLE: dto.TITLE,
      },
      relations: ['EFFECT', 'SECTION'],
    });
  }

  async migration(dto: MigrationMatrixItemMasterDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      for (const d of dto.data) {
        await this.insert(d, queryRunner);
      }
      if (queryRunner.isTransactionActive) {
        await queryRunner.commitTransaction();
      }
      return {
        status: true,
        message: 'Migration successful',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async insert(dto: CreateMatrixItemMasterDto, queryRunner?: QueryRunner) {
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

      await runner.manager.insert(MatrixItemMaster, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        data: dto,
        message: 'Insert Matrix Item Master Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert Matrix Item Master Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async update(dto: UpdateMatrixItemMasterDto, queryRunner?: QueryRunner) {
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
      const {ID, ...updateData} = dto;
      await runner.manager.update(MatrixItemMaster, ID, updateData);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        data: dto,
        message: 'Update Matrix Item Master Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Update Matrix Item Master Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async delete(ID: number, queryRunner?: QueryRunner) {
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
      await runner.manager.delete(MatrixItemMaster, ID);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Delete Matrix Item Master Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Delete Matrix Item Master Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
