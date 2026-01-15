import { Injectable } from '@nestjs/common';
import { CreateEbudgetQuotationDto } from './dto/create-ebudget-quotation.dto';
import { UpdateEbudgetQuotationDto } from './dto/update-ebudget-quotation.dto';
import { EBUDGET_QUOTATION } from 'src/common/Entities/ebudget/table/EBUDGET_QUOTATION.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { now } from 'src/common/utils/dayjs.utils';

@Injectable()
export class EbudgetQuotationService {
  constructor(
    @InjectRepository(EBUDGET_QUOTATION, 'ebudgetConnection')
    private readonly repo: Repository<EBUDGET_QUOTATION>,
    @InjectDataSource('ebudgetConnection')
    private dataSource: DataSource,
  ) {}

  async getData(dto: UpdateEbudgetQuotationDto) {
    return this.repo.find({
      where: dto,
    });
  }

  async insert(dto: CreateEbudgetQuotationDto, queryRunner?: QueryRunner) {
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

      const res = await runner.manager.save(EBUDGET_QUOTATION, dto);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert EBUDGET_QUOTATION Successfully',
        data: res,
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Insert EBUDGET_QUOTATION Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }

  async update(dto: UpdateEbudgetQuotationDto, queryRunner?: QueryRunner) {
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
      const res = await runner.manager.update(EBUDGET_QUOTATION, ID, {
        ...updateData,
        DATE_UPDATE: now('YYYY-MM-DD HH:mm:ss'),
      });
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        data: res,
        message: 'Update EBUDGET_QUOTATION Successfully',
      };
    } catch (error) {
      if (localRunner && didStartTx && localRunner.isTransactionActive)
        await localRunner.rollbackTransaction();
      throw new Error('Update EBUDGET_QUOTATION Error: ' + error.message);
    } finally {
      if (localRunner && didConnect) await localRunner.release();
    }
  }
}
