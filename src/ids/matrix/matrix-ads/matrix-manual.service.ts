import { Injectable } from '@nestjs/common';
import { CreateMatrixManualDto } from './dto/create-matrix-manual.dto';
import { UpdateMatrixManualDto } from './dto/update-matrix-manual.dto';
import { MatrixManual } from './entities/matrix-manual.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { now } from 'src/common/utils/dayjs.utils';

@Injectable()
export class MatrixManualService {
  constructor(
    @InjectRepository(MatrixManual, 'idsConnection')
    private matrixManualRepository: Repository<MatrixManual>,
    @InjectDataSource('idsConnection')
    private readonly dataSource: DataSource,
  ) {}

  findAll() {
    return this.matrixManualRepository.find();
  }

  findOne(id: number) {
    return this.matrixManualRepository.findOneBy({ ID: id });
  }

  async insert(dto: CreateMatrixManualDto, queryRunner?: QueryRunner) {
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

      const res = await runner.manager.save(MatrixManual, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        data: await this.findOne(res.ID),
        message: 'Insert Matrix Manual Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert Matrix Manual Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async update(dto: UpdateMatrixManualDto, queryRunner?: QueryRunner) {
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
      const { ID, ...updateData } = dto;
      await runner.manager.update(MatrixManual, ID, {
        ...updateData,
        DATEUPDATE: now('YYYY-MM-DD HH:mm:ss'),
      });
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        data: await this.findOne(ID),
        message: 'Update Matrix Manual Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Update Matrix Manual Error: ' + error.message);
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
      await runner.manager.delete(MatrixManual, ID);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Delete Matrix Manual Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Delete Matrix Manual Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
