import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Pricelist } from './entities/pricelist.entity';

@Injectable()
export class PricelistService {
  constructor(
    @InjectRepository(Pricelist, 'spsysConnection')
    private readonly price: Repository<Pricelist>,
  ) {}

  async findAll() {
    return this.price.find();
  }
}
