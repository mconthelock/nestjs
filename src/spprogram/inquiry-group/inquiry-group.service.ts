import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { InquiryGroup } from './entities/inquiry-group.entity';

@Injectable()
export class InquiryGroupService {
  constructor(
    @InjectRepository(InquiryGroup, 'amecConnection')
    private readonly group: Repository<InquiryGroup>,
  ) {}
}
