import { Injectable } from '@nestjs/common';
import { CreateInquiryDetailDto } from './dto/create-inquiry-detail.dto';
import { UpdateInquiryDetailDto } from './dto/update-inquiry-detail.dto';

@Injectable()
export class InquiryDetailService {
  create(createInquiryDetailDto: CreateInquiryDetailDto) {
    return 'This action adds a new inquiryDetail';
  }

  findAll() {
    return `This action returns all inquiryDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inquiryDetail`;
  }

  update(id: number, updateInquiryDetailDto: UpdateInquiryDetailDto) {
    return `This action updates a #${id} inquiryDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiryDetail`;
  }
}
