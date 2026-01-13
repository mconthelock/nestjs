import { Injectable } from '@nestjs/common';
import { CreateEbgreqformDto } from './dto/create-ebgreqform.dto';
import { UpdateEbgreqformDto } from './dto/update-ebgreqform.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { EBGREQFORM } from 'src/common/Entities/ebudget/table/EBGREQFORM.entity';

@Injectable()
export class EbgreqformService {
  constructor(
    @InjectRepository(EBGREQFORM, 'ebudgetConnection')
    private readonly repo: Repository<EBGREQFORM>,
    @InjectDataSource('ebudgetConnection')
    private dataSource: DataSource,
  ) {}

  async upsert(
    dto: CreateEbgreqformDto,
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

      const res = await runner.manager.save(EBGREQFORM, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert EBGREQFORM Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert EBGREQFORM Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
