import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InquiryDetail } from './entities/inquiry-detail.entity';
import { createDto } from './dto/create.dto';

@Injectable()
export class InquiryDetailService {
  constructor(
    @InjectRepository(InquiryDetail, 'amecConnection')
    private readonly detail: Repository<InquiryDetail>,
  ) {}

  create(createDto: createDto) {
    const inquiryDetail = this.detail.create(createDto);
    return this.detail.save(inquiryDetail);
  }
}
