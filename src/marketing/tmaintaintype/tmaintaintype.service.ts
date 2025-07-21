import { Tmaintaintype } from './entities/tmaintaintype.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TmaintaintypeService {
  constructor(
    @InjectRepository(Tmaintaintype, 'amecConnection')
    private readonly msttype: Repository<Tmaintaintype>,
  ) {}

  findAll() {
    return this.msttype.find({ order: { ABBREVIATION: 'asc' } });
  }
}
