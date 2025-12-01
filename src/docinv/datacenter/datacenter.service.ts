import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TableCheck } from './entities/table-check.entity';

@Injectable()
export class DatacenterService {
  constructor(
    @InjectRepository(TableCheck, 'amecConnection')
    private readonly table: Repository<TableCheck>,
  ) {}

  async findAll() {
    return this.table.find();
  }
}
