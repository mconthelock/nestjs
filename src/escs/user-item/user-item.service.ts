import { Injectable } from '@nestjs/common';
import { ESCSCreateUserItemDto } from './dto/create-user-item.dto';
import { ESCSUpdateUserItemDto } from './dto/update-user-item.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ESCSUserItem } from './entities/user-item.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ESCSUserItemService {
  constructor(
    @InjectRepository(ESCSUserItem, 'escsConnection')
    private userItemRepo: Repository<ESCSUserItem>,
    @InjectDataSource('escsConnection')
    private dataSource: DataSource,
  ) {}

  async addUserItem(dto: ESCSCreateUserItemDto, queryRunner?: QueryRunner) {
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

      await runner.manager.save(ESCSUserItem, dto);
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
