import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { QaType } from './entities/qa_type.entity';

@Injectable()
export class QaTypeService {
  constructor(
    @InjectRepository(QaType, 'webformConnection')
    private qatypeRepo: Repository<QaType>,
    @InjectDataSource('webformConnection')
    private dataSource: DataSource,
  ) {}

  getQaTypeAll() {
    return this.qatypeRepo.find();
  }

  getQaTypeByCode(code: string) {
    return this.qatypeRepo.findOne({ where: { QAT_CODE: code } });
  }
}
