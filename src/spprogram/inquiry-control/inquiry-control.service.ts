import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InquiryControl } from './entities/inquiry-control.entity';
import { UpdateControllerDto } from './dto/update-controller.dto';

@Injectable()
export class InquiryControlService {
  constructor(
    @InjectRepository(InquiryControl, 'spsysConnection')
    private readonly ctrl: Repository<InquiryControl>,
  ) {}

  findAll() {
    return this.ctrl.find();
  }

  update(updateDto: UpdateControllerDto) {
    // Update logic here
  }
}
