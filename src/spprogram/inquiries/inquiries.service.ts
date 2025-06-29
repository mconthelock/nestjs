import { Injectable } from '@nestjs/common';
import { CreateInquiryInput } from './dto/create-inquiry.input';
import { UpdateInquiryInput } from './dto/update-inquiry.input';

@Injectable()
export class InquiriesService {
  create(createInquiryInput: CreateInquiryInput) {
    return 'This action adds a new inquiry';
  }

  findAll() {
    return `This action returns all inquiries`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inquiry`;
  }

  update(id: number, updateInquiryInput: UpdateInquiryInput) {
    return `This action updates a #${id} inquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiry`;
  }
}
