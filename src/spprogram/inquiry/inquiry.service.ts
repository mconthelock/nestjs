import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Inquiry } from './entities/inquiry.entity';

import { searchDto } from './dto/search.dto';
import { createDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry, 'amecConnection')
    private readonly inq: Repository<Inquiry>,
  ) {}

  async search(searchDto: searchDto) {
    const q = { INQ_LATEST: 1 };
    return this.inq.find({
      where: {
        ...searchDto,
        ...q,
      },
      order: { INQ_ID: 'DESC' },
      relations: ['inqgroup'],
    });
  }

  async create(createDto: createDto) {
    const inquiry = this.inq.create(createDto);
    const data = await this.inq.save(inquiry);
    return this.inq.findOne({
      where: { INQ_NO: data.INQ_NO, INQ_LATEST: 1 },
    });
  }
}
