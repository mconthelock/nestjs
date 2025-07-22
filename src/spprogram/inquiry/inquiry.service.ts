import { Inquiry } from './entities/inquiry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { searchDto } from './dto/search.dto';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry, 'amecConnection')
    private readonly inq: Repository<Inquiry>,
  ) {}

  search(searchDto: searchDto) {
    const q = { INQ_LATEST: 1 };
    return this.inq.find({
      where: {
        ...searchDto,
        ...q,
      },
    });
  }
}
