import { Injectable } from '@nestjs/common';
import { CreateInquiryGroupDto } from './dto/create-inquiry-group.dto';
import { UpdateInquiryGroupDto } from './dto/update-inquiry-group.dto';

@Injectable()
export class InquiryGroupService {
  create(createInquiryGroupDto: CreateInquiryGroupDto) {
    return 'This action adds a new inquiryGroup';
  }

  findAll() {
    return `This action returns all inquiryGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inquiryGroup`;
  }

  update(id: number, updateInquiryGroupDto: UpdateInquiryGroupDto) {
    return `This action updates a #${id} inquiryGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiryGroup`;
  }
}
