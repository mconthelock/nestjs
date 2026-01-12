import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InquiryDetail } from './entities/inquiry-detail.entity';
import { createDetailDto } from './dto/create.dto';

@Injectable()
export class InquiryDetailService {
  constructor(
    @InjectRepository(InquiryDetail, 'spsysConnection')
    private readonly detail: Repository<InquiryDetail>,
  ) {}

  async create(createDto: createDetailDto) {
    const inquiryDetail = await this.detail.create(createDto);
    return await this.detail.save(inquiryDetail);
  }
}
