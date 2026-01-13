import { Injectable } from '@nestjs/common';
import { CreateEbgreqcolImageDto } from './dto/create-ebgreqcol-image.dto';
import { UpdateEbgreqcolImageDto } from './dto/update-ebgreqcol-image.dto';
import { EBGREQCOL_IMAGE } from 'src/common/Entities/ebudget/table/EBGREQCOL_IMAGE.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class EbgreqcolImageService {
  constructor(
    @InjectRepository(EBGREQCOL_IMAGE, 'ebudgetConnection')
    private readonly repo: Repository<EBGREQCOL_IMAGE>,
    @InjectDataSource('ebudgetConnection')
    private dataSource: DataSource,
  ) {}

  async upsert(dto: CreateEbgreqcolImageDto, queryRunner?: QueryRunner) {
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

      const res = await runner.manager.save(EBGREQCOL_IMAGE, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert EBGREQCOL_IMAGE Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert EBGREQCOL_IMAGE Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
