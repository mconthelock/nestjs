import { Injectable } from '@nestjs/common';
import { CreateIsFileDto } from './dto/create-is-file.dto';
import { UpdateIsFileDto } from './dto/update-is-file.dto';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IsFile } from './entities/is-file.entity';
import { FILE } from 'dns';
import { SearchIsFileDto } from './dto/search-is-file.dto';

@Injectable()
export class IsFileService {
  constructor(
    @InjectRepository(IsFile, 'webformConnection')
    private readonly isFileRepo: Repository<IsFile>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  async getIsFile(dto: SearchIsFileDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(IsFile)
      : this.isFileRepo;
    return repo.find({
      where: dto,
      order: {
        FILE_ID: 'ASC',
      },
    });
  }

  async setId(dto: SearchIsFileDto, queryRunner?: QueryRunner) {
    const lastID = queryRunner
      ? await this.getNextSeq(dto, queryRunner)
      : await this.getNextSeq(dto);
    if (lastID.length > 0) {
      return lastID[0].FILE_ID + 1;
    } else {
      return 1;
    }
  }

  async getNextSeq(dto: SearchIsFileDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(IsFile)
      : this.isFileRepo;
    return repo.find({
      where: dto,
      order: {
        FILE_ID: 'DESC',
      },
      take: 1,
    });
  }

  async insert(dto: CreateIsFileDto, queryRunner?: QueryRunner) {
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
      const id = await this.setId(dto, runner);
      const data = {
        ...dto,
        FILE_ID: id,
      };

      const res = await runner.manager.insert(IsFile, data);
      if (localRunner && didStartTx && runner.isTransactionActive)
        await localRunner.commitTransaction();
      return {
        status: true,
        message: 'Insert IS File Successfully',
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
