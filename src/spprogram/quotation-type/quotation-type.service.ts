import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

import { QuotationType } from './entities/quotation-type.entity';
import { createDto } from './dto/create.dto';

@Injectable()
export class QuotationTypeService {
  constructor(
    @InjectRepository(QuotationType, 'spsysConnection')
    private readonly quotype: Repository<QuotationType>,
  ) {}

  findAll() {
    return this.quotype.find();
  }

  findOne(id: string) {
    return this.quotype.findOne({ where: { QUOTYPE_ID: id } });
  }

  async create(createDto: createDto) {
    const quotype = this.quotype.create(createDto);
    const res = await this.quotype.save(quotype);
    return this.quotype.findOne({ where: res });
  }
}
