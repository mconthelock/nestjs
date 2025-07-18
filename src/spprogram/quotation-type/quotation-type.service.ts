import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { QuotationType } from './entities/quotation-type.entity';

@Injectable()
export class QuotationTypeService {
  constructor(
    @InjectRepository(QuotationType, 'amecConnection')
    private readonly type: Repository<QuotationType>,
  ) {}
}
