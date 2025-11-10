import { Injectable } from '@nestjs/common';
import { CreateChemicalSectionDto } from './dto/create-chemical-section.dto';
import { UpdateChemicalSectionDto } from './dto/update-chemical-section.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ChemicalSection } from './entities/chemical-section.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { now } from 'src/common/utils/dayjs.utils';

@Injectable()
export class ChemicalSectionService {
  constructor(
      @InjectRepository(ChemicalSection, 'gpreportConnection')
      private readonly mtxRepo: Repository<ChemicalSection>,
      @InjectDataSource('gpreportConnection')
      private readonly dataSource: DataSource,
    ) {}

  async update(dto: UpdateChemicalSectionDto, queryRunner?: QueryRunner) {
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
        const {AMEC_SDS_ID, OWNERCODE, ...data} = dto;
        const condition = {
            AMEC_SDS_ID: dto.AMEC_SDS_ID,
            OWNERCODE: dto.OWNERCODE,
        };
        await runner.manager.update(ChemicalSection, condition, {...data, UPDATE_DATE: now('YYYY-MM-DD HH:mm:ss')});
        if (localRunner && didStartTx && runner.isTransactionActive)
          await localRunner.commitTransaction();
        return {
          status: true,
          message: 'Update Chemical Section Successfully',
        };
      } catch (error) {
        if (localRunner && didStartTx && localRunner.isTransactionActive)
          await localRunner.rollbackTransaction();
        throw new Error('Update Chemical Section Error: ' + error.message);
      } finally {
        if (localRunner && didConnect) await localRunner.release();
      }
    }

}
