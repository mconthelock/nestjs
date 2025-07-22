import { Mscountry } from './entities/mscountry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MscountryService {
  constructor(
    @InjectRepository(Mscountry, 'amecConnection')
    private readonly country: Repository<Mscountry>,
  ) {}

  findAll() {
    return this.country.find({ order: { CTNAME: 'asc' } });
  }
}
