import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Currency } from './entities/currency.entity';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency, 'amecConnection')
    private readonly curr: Repository<Currency>,
  ) {}

  findAll() {
    return this.curr.find();
  }

  findPeriod(year: string, period: string) {
    return this.curr.find({ where: { CURR_YEAR: year, CURR_PERIOD: period } });
  }
}
