import { Injectable } from '@nestjs/common';
import { ESCSCreateUserFileDto } from './dto/create-user-file.dto';
import { ESCSUpdateUserFileDto } from './dto/update-user-file.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { ESCSUserFile } from './entities/user-file.entity';

@Injectable()
export class ESCSUserFileService {
   constructor(
      @InjectRepository(ESCSUserFile, 'amecConnection')
      private userFileRepo: Repository<ESCSUserFile>,
      @InjectDataSource('amecConnection')
      private dataSource: DataSource,
    ) {}
  
    async addUserFile(dto: ESCSCreateUserFileDto, queryRunner?: QueryRunner) {
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
  
        await runner.manager.insert(ESCSUserFile, dto);
        if (localRunner && didStartTx && runner.isTransactionActive)
          await localRunner.commitTransaction();
        return {
          status: true,
          message: 'Insert user file Successfully',
        };
      } catch (error) {
        if (localRunner && didStartTx && localRunner.isTransactionActive)
          await localRunner.rollbackTransaction();
        throw new Error('Insert user file ' + error.message);
      } finally {
        if (localRunner && didConnect) await localRunner.release();
      }
    }

    async newId(dto: ESCSUpdateUserFileDto): Promise<number> {
      const result = await this.userFileRepo.createQueryBuilder()
        .select("MAX(UF_ID)", "max")
        .where("UF_USR_NO = :user", { user: dto.UF_USR_NO })
        .andWhere("UF_ITEM = :item", { item: dto.UF_ITEM })
        .andWhere("UF_STATION = :station", { station: dto.UF_STATION })
        .getRawOne();
      return result.max + 1;
    }
}
