import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InquiryControl } from './entities/inquiry-control.entity';

@Injectable()
export class InquiryControlService {
  constructor(
    @InjectRepository(InquiryControl, 'spsysConnection')
    private readonly ctrl: Repository<InquiryControl>,
  ) {}

  findAll() {
    return this.ctrl.find();
  }
}
