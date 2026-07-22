import { Injectable } from '@nestjs/common';
import { CreatePcurrencyDto } from './dto/create-pcurrency.dto';
import { UpdatePcurrencyDto } from './dto/update-pcurrency.dto';
import { PcurrencyRepository } from './pcurrency.repository';

@Injectable()
export class PcurrencyService {
  constructor(private readonly repo : PcurrencyRepository) {}
  findCurrency() {
    return this.repo.findCurrency();
  } 
}
