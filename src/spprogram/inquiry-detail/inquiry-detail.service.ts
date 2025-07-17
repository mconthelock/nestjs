import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateInquiryDetailDto } from './dto/create-inquiry-detail.dto';
import { UpdateInquiryDetailDto } from './dto/update-inquiry-detail.dto';
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
