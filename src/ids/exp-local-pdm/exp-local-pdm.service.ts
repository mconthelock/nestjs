import { Injectable } from '@nestjs/common';
import { CreateExpLocalPdmDto } from './dto/create-exp-local-pdm.dto';
import { UpdateExpLocalPdmDto } from './dto/update-exp-local-pdm.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ExpLocalPdm } from './entities/exp-local-pdm.entity';

@Injectable()
export class ExpLocalPdmService {
   constructor(
      @InjectRepository(ExpLocalPdm, 'pdmConnection')
      private repo: Repository<ExpLocalPdm>,
      @InjectDataSource('pdmConnection')
      private readonly dataSource: DataSource,
    ) {}
  
  create(createExpLocalPdmDto: CreateExpLocalPdmDto) {
    return 'This action adds a new expLocalPdm';
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} expLocalPdm`;
  }

  update(id: number, updateExpLocalPdmDto: UpdateExpLocalPdmDto) {
    return `This action updates a #${id} expLocalPdm`;
  }

  remove(id: number) {
    return `This action removes a #${id} expLocalPdm`;
  }
}
