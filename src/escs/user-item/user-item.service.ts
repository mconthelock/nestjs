import { Injectable } from '@nestjs/common';
import { CreateUserItemDto } from './dto/create-user-item.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { USERS_ITEM } from 'src/common/Entities/escs/table/USERS_ITEM.entity';

@Injectable()
export class UserItemService {
  constructor(
    @InjectRepository(USERS_ITEM, 'escsConnection')
    private userItemRepo: Repository<USERS_ITEM>,
    @InjectDataSource('escsConnection')
    private dataSource: DataSource,
  ) {}

  async addUserItem(dto: CreateUserItemDto, queryRunner?: QueryRunner) {
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

      await runner.manager.save(USERS_ITEM, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert user item Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert user item ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
