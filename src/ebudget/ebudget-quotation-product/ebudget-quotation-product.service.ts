import { Injectable } from '@nestjs/common';
import { CreateEbudgetQuotationProductDto } from './dto/create-ebudget-quotation-product.dto';
import { UpdateEbudgetQuotationProductDto } from './dto/update-ebudget-quotation-product.dto';
import { EBUDGET_QUOTATION_PRODUCT } from 'src/common/Entities/ebudget/table/EBUDGET_QUOTATION_PRODUCT.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class EbudgetQuotationProductService {
  constructor(
    @InjectRepository(EBUDGET_QUOTATION_PRODUCT, 'ebudgetConnection')
    private readonly repo: Repository<EBUDGET_QUOTATION_PRODUCT>,
    @InjectDataSource('ebudgetConnection')
    private dataSource: DataSource,
  ) {}

  async insert(
    dto: CreateEbudgetQuotationProductDto,
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

      const res = await runner.manager.save(EBUDGET_QUOTATION_PRODUCT, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert EBUDGET_QUOTATION_PRODUCT Successfully',
        data: res,
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error(
        'Insert EBUDGET_QUOTATION_PRODUCT Error: ' + error.message,
      );
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async getData(id: number) {
    return this.repo.find({
      where: {
        QUOTATION_ID: id
      },
      order: {
        SEQ: 'ASC'
      }
    });
  }
}
