import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InquiryLog } from './entities/inquiry-log.entity';

@Injectable()
export class InquiryLogService {
  constructor(
    @InjectRepository(InquiryLog, 'spsysConnection')
    private readonly logs: Repository<InquiryLog>,
  ) {}
}
