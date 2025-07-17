import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateInquiryGroupDto } from './dto/create-inquiry-group.dto';
import { UpdateInquiryGroupDto } from './dto/update-inquiry-group.dto';
import { InquiryGroup } from './entities/inquiry-group.entity';

@Injectable()
export class InquiryGroupService {
  constructor(
    @InjectRepository(InquiryGroup, 'amecConnection')
    private readonly group: Repository<InquiryGroup>,
  ) {}
}
