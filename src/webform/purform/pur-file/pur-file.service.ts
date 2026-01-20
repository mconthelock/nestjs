import { Injectable } from '@nestjs/common';
import { CreatePurFileDto } from './dto/create-pur-file.dto';
import { UpdatePurFileDto } from './dto/update-pur-file.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PUR_FILE } from 'src/common/Entities/webform/tables/PUR_FILE.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { SearchPurFileDto } from './dto/search-pur-file.dto';

@Injectable()
export class PurFileService {
  constructor(
    @InjectRepository(PUR_FILE, 'webformConnection')
    private readonly repo: Repository<PUR_FILE>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  async getFile(dto: SearchPurFileDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(PUR_FILE)
      : this.repo;
    return repo.find({
      where: dto,
      order: {
        FILE_ID: 'ASC',
      },
    });
  }

  async insert(dto: CreatePurFileDto, queryRunner?: QueryRunner) {
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
  
        const res = await runner.manager.insert(PUR_FILE, dto);
        if (localRunner && didStartTx && runner.isTransactionActive)
          await localRunner.commitTransaction();
        return {
          status: true,
          message: 'Insert PUR File Successfully',
        };
      } catch (error) {
        if (localRunner && didStartTx && localRunner.isTransactionActive)
          await localRunner.rollbackTransaction();
        throw new Error('Insert IS File Error: ' + error.message);
      } finally {
        if (localRunner && didConnect) await localRunner.release();
      }
    }
}
