import { Injectable } from '@nestjs/common';
import { ESCSCreateUserItemStationDto } from './dto/create-user-item-station.dto';
import { ESCSUpdateUserItemStationDto } from './dto/update-user-item-station.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ESCSUserItemStation } from './entities/user-item-station.entity';

@Injectable()
export class ESCSUserItemStationService {
     constructor(
        @InjectRepository(ESCSUserItemStation, 'amecConnection')
        private userItemStationRepo: Repository<ESCSUserItemStation>,
        @InjectDataSource('amecConnection')
        private dataSource: DataSource,
      ) {}
   async addUserItemStation(dto: ESCSCreateUserItemStationDto, queryRunner?: QueryRunner) {
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
  
        await runner.manager.save(ESCSUserItemStation, dto);
        if (localRunner && didStartTx && runner.isTransactionActive)
          await localRunner.commitTransaction();
        return {
          status: true,
          message: 'Insert user item station Successfully',
        };
      } catch (error) {
        if (localRunner && didStartTx && localRunner.isTransactionActive)
          await localRunner.rollbackTransaction();
        throw new Error('Insert user item station ' + error.message);
      } finally {
        if (localRunner && didConnect) await localRunner.release();
      }
    }
}
