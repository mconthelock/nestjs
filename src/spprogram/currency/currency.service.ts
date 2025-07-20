import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { Currency } from './entities/currency.entity';
import { updateDto } from './dto/update.dto';

@Injectable()
export class CurrencyService {
  constructor(
    @InjectRepository(Currency, 'amecConnection')
    private readonly curr: Repository<Currency>,
  ) {}

  findAll() {
    return this.curr.find();
  }

  findPeriod(year: number, period: number) {
    return this.curr.find({ where: { CURR_YEAR: year, CURR_PERIOD: period } });
  }

  async update(updateDto: updateDto) {
    const record = await this.curr.find({
      where: {
        CURR_YEAR: updateDto.CURR_YEAR,
        CURR_PERIOD: updateDto.CURR_PERIOD,
        CURR_CODE: updateDto.CURR_CODE,
      },
    });
    const updatedCurr = { ...record[0], ...updateDto };
    console.log(updateDto, updatedCurr);

    const res = await this.curr.save(updatedCurr);
    return this.curr.find({
      where: {
        CURR_YEAR: res.CURR_YEAR,
        CURR_PERIOD: res.CURR_PERIOD,
        CURR_CODE: updateDto.CURR_CODE,
      },
    });
  }
}
