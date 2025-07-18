import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InquiryDetail } from './entities/inquiry-detail.entity';

@Injectable()
export class InquiryDetailService {
  constructor(
    @InjectRepository(InquiryDetail, 'amecConnection')
    private readonly detail: Repository<InquiryDetail>,
  ) {}

  findDetail(id) {
    return this.detail.find({ where: { INQD_ID: id } });
  }
}
