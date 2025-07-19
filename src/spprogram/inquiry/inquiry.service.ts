import { Inquiry } from './entities/inquiry.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InquiryService {
  constructor(
    @InjectRepository(Inquiry, 'amecConnection')
    private readonly inquiryRepository: Repository<Inquiry>,
  ) {}
}
