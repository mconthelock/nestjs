import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

import { Inquiry } from './entities/inquiry.entity';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry, 'amecConnection')
    private readonly inq: Repository<Inquiry>,
  ) {}

  findOne(id: number) {
    return this.inq.find({ where: { INQ_ID: id } });
  }

  create(createInquiryDto: CreateInquiryDto) {
    const inqdata = this.inq.create(createInquiryDto);
    const result = this.inq.save(inqdata);
  }

  findAll() {
    return `This action returns all inquiry`;
  }

  update(id: number, updateInquiryDto: UpdateInquiryDto) {
    return `This action updates a #${id} inquiry`;
  }

  remove(id: number) {
    return `This action removes a #${id} inquiry`;
  }
}
