import { Injectable } from '@nestjs/common';
import { CreateInquiryControlDto } from './dto/create-inquiry-control.dto';
import { UpdateInquiryControlDto } from './dto/update-inquiry-control.dto';

@Injectable()
export class InquiryControlService {
  create(createInquiryControlDto: CreateInquiryControlDto) {
    return 'This action adds a new inquiryControl';
  }

  findAll() {
    return `This action returns all inquiryControl`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inquiryControl`;
  }

  update(id: number, updateInquiryControlDto: UpdateInquiryControlDto) {
    return `This action updates a #${id} inquiryControl`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiryControl`;
  }
}
