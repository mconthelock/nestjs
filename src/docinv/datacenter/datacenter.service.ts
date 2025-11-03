import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ATableList } from './entities/a-table-list.entity';

@Injectable()
export class DatacenterService {
  constructor(
    @InjectRepository(ATableList, 'amecConnection')
    private readonly table: Repository<ATableList>,
  ) {}

  async findAll(): Promise<ATableList[]> {
    return this.table.find();
  }
}
