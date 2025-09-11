import { Pricelist } from './entities/pricelist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PricelistService {
  constructor(
    @InjectRepository(Pricelist, 'spsysConnection')
    private readonly price: Repository<Pricelist>,
  ) {}
}
