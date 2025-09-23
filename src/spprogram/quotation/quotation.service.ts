import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Quotation } from './entities/quotation.entity';
import { createQuotationDto } from './dto/create-quotation.dto';

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(Quotation, 'spsysConnection')
    private readonly quo: Repository<Quotation>,
  ) {}

  async createQuotation(data: createQuotationDto) {
    const quotation = this.quo.create(data);
    return this.quo.save(quotation);
  }
}
