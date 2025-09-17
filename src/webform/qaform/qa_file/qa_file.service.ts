import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateQaFileDto } from './dto/create-qa_file.dto';
import { UpdateQaFileDto } from './dto/update-qa_file.dto';
import { SearchQaFileDto } from './dto/search-qa_file.dto';
import { QaFile } from './entities/qa_file.entity';
import { moveFileFromMulter } from 'src/common/utils/files.utils';

@Injectable()
export class QaFileService {
  constructor(
    @InjectRepository(QaFile, 'amecConnection')
    private readonly qaformRepo: Repository<QaFile>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}
  async createQaFile(dto: CreateQaFileDto, queryRunner?: QueryRunner) {
    let localRunner: QueryRunner | undefined;
    try {
      if (!queryRunner) {
        localRunner = this.dataSource.createQueryRunner();
        await localRunner.connect();
        await localRunner.startTransaction();
      }
      const runner = queryRunner || localRunner!;

      const condition = {
        NFRMNO: dto.NFRMNO,
        VORGNO: dto.VORGNO,
        CYEAR: dto.CYEAR,
        CYEAR2: dto.CYEAR2,
        NRUNNO: dto.NRUNNO,
        FILE_TYPECODE: dto.FILE_TYPECODE,
      };

      const id = await this.setId(condition, runner);
      console.log('id', id);
      
      const data = {
        ...dto,
        FILE_ID: id,
      };

      await runner.manager.save(QaFile, data);
      if (localRunner) await localRunner.commitTransaction();
      return { status: true, message: 'Inserted Successfully' };
    } catch (error) {
      if (localRunner) {
        await localRunner.rollbackTransaction();
        return { status: false, message: 'Error: ' + error.message };
      } else {
        throw error;
      }
    } finally {
      if (localRunner) await localRunner.release();
    }
  }

  async setId(dto: SearchQaFileDto, queryRunner?: QueryRunner) {
    const lastID = queryRunner
      ? await this.getNextSeq(dto, queryRunner)
      : await this.getNextSeq(dto);
    if (lastID.length > 0) {
      return lastID[0].FILE_ID + 1;
    } else {
      return 1;
    }
  }

  async getNextSeq(dto: SearchQaFileDto, queryRunner?: QueryRunner) {
    const repo = queryRunner
      ? queryRunner.manager.getRepository(QaFile)
      : this.qaformRepo;
    return repo.find({
      where: dto,
      order: {
        FILE_ID: 'DESC',
      },
      take: 1,
    });
  }
}
