import { Injectable } from '@nestjs/common';
import { CreateEbgreqattfileDto } from './dto/create-ebgreqattfile.dto';
import { UpdateEbgreqattfileDto } from './dto/update-ebgreqattfile.dto';
import { EBGREQATTFILE } from 'src/common/Entities/ebudget/table/EBGREQATTFILE.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class EbgreqattfileService {
  constructor(
    @InjectRepository(EBGREQATTFILE, 'ebudgetConnection')
    private readonly repo: Repository<EBGREQATTFILE>,
    @InjectDataSource('ebudgetConnection')
    private dataSource: DataSource,
  ) {}

  async upsert(dto: CreateEbgreqattfileDto, queryRunner?: QueryRunner) {
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

      const res = await runner.manager.save(EBGREQATTFILE, dto);
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
}
