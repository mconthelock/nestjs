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

  async create(createDto: createDto) {
    const inquiryDetail = await this.detail.create(createDto);
    return await this.detail.save(inquiryDetail);
  }
}
