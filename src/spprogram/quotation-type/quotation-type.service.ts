import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateQuotationTypeDto } from './dto/create-quotation-type.dto';
import { UpdateQuotationTypeDto } from './dto/update-quotation-type.dto';
import { QuotationType } from './entities/quotation-type.entity';

@Injectable()
export class QuotationTypeService {
  constructor(
    @InjectRepository(QuotationType, 'amecConnection')
    private readonly type: Repository<QuotationType>,
  ) {}
}
