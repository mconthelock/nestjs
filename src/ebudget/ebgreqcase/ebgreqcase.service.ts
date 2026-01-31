import { Injectable } from '@nestjs/common';
import { CreateEbgreqcaseDto } from './dto/create-ebgreqcase.dto';
import { UpdateEbgreqcaseDto } from './dto/update-ebgreqcase.dto';
import { EBGREQCASE } from 'src/common/Entities/ebudget/table/EBGREQCASE.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EbgreqcaseService {
    constructor(
        @InjectRepository(EBGREQCASE, 'ebudgetConnection')
        private readonly repo: Repository<EBGREQCASE>,
        @InjectDataSource('ebudgetConnection')
        private dataSource: DataSource,
    ) {}
    
  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ ID: id });
  }
}
