import { Injectable } from '@nestjs/common';
import { ESCSCreateUserAuthorizeDto } from './dto/create-user-authorize.dto';
import { ESCSUpdateUserAuthorizeDto } from './dto/update-user-authorize.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ESCSUserAuthorize } from './entities/user-authorize.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class ESCSUserAuthorizeService {
  constructor(
    @InjectRepository(ESCSUserAuthorize, 'amecConnection')
    private userAuthRepo: Repository<ESCSUserAuthorize>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  async addUserAuth(
    dto: ESCSCreateUserAuthorizeDto,
    queryRunner?: QueryRunner,
  ) {
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

      await runner.manager.save(ESCSUserAuthorize, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert user Auth Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert user Auth ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
