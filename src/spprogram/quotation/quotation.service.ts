import { Quotation } from './entities/quotation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class QuotationService {
  constructor(
    @InjectRepository(Quotation, 'spsysConnection')
    private readonly quotationRepository: Repository<Quotation>,
  ) {}
}
