// pis-locks.service.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { UpdateLockPiDto } from './dto/update-lock-pi.dto';
import { CreateLockPiDto } from './dto/create-lock-pi.dto';
import { LockPis } from './entities/lock-pi.entity';

@Injectable()
export class LockPisService {
  constructor(
    @InjectRepository(LockPis, 'webformConnection')
    private readonly lockpisRepo: Repository<LockPis>,
    @InjectDataSource('webformConnection')
    private readonly dataSource: DataSource,
  ) {}

  async lock(dto: CreateLockPiDto) {
    const runner = this.dataSource.createQueryRunner();
    await runner.connect();
    await runner.startTransaction();
    try {
      try {
        await this.create(dto, runner);
        await runner.commitTransaction();
        return { status: true };
      } catch (e: any) {
        // ชน UNIQUE → มีคนล็อกอยู่
        if (String(e.message).includes('ORA-00001')) {
          const row = await this.findOne(dto.ITEM_NO, dto.ORD_NO, runner); // เช็คอีกที
          await runner.rollbackTransaction();
          return {
            status: false,
            reason: 'locked',
            ownerEmpno: row?.LOCKED_BY_EMPNO,
          };
        }
        await runner.rollbackTransaction();
        throw e;
      }
    } finally {
      await runner.release();
    }
  }

  async unlock(itemId: string, ordNo: string, socketId: string) {
    await this.delete({ ITEM_NO: itemId, ORD_NO: ordNo, SOCKET_ID: socketId });
  }

  async disconnect(socketId: string) {
    await this.delete({ SOCKET_ID: socketId });
  }

  async logout(empno: string) {
    await this.delete({ LOCKED_BY_EMPNO: empno });
  }

  async findAll() {
    return await this.lockpisRepo.find();
  }

  async findOne(item: string, order: string, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(LockPis)
      : this.lockpisRepo;
    return repo.findOneBy({ ITEM_NO: item, ORD_NO: order });
  }

  async search(dto: UpdateLockPiDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(LockPis)
      : this.lockpisRepo;
    return repo.find({ where: dto });
  }

  async create(dto: CreateLockPiDto, queryRunner?: QueryRunner) {
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

      await runner.manager.insert(LockPis, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert Lockpis Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert Lockpis ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async delete(dto: UpdateLockPiDto, queryRunner?: QueryRunner) {
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

      await runner.manager.delete(LockPis, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Delete Lockpis Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Delete Lockpis ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async deleteAll() {
    return this.lockpisRepo.clear();
  }
}
