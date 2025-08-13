import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { CreateQainsFormDto } from './dto/create-qains_form.dto';
import { moveFileFromMulter } from 'src/utils/files';
import { QainsForm } from '../qains_form/entities/qains_form.entity';

@Injectable()
export class QainsFormService {
  constructor(
    @InjectRepository(QainsForm, 'amecConnection')
    private readonly qaformRepo: Repository<QainsForm>,
    @InjectDataSource('amecConnection')
    private dataSource: DataSource,
  ) {}

  async create(
    dto: CreateQainsFormDto,
    files: Express.Multer.File[],
    path: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      
      const moveFile = await Promise.all(
        files.map((file) => {
          return { files: moveFileFromMulter(file, path) };
        }),
      );

      return { message: 'Upload success', files: moveFile, data: dto };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { status: false, message: 'Error: ' + error.message };
    } finally {
      await queryRunner.release();
    }
  }
}
