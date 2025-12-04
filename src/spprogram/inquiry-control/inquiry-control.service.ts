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

  async update(updateDto: UpdateControllerDto) {
    const inqs = await this.ctrl.find({
      where: {
        CNT_PREFIX: updateDto.CNT_PREFIX,
        CNT_AGENT: updateDto.CNT_AGENT,
        CNT_TRADER: updateDto.CNT_TRADER,
      },
    });
    await this.ctrl.update(inqs[0], updateDto);
    return this.ctrl.findOneBy({
      CNT_PREFIX: updateDto.CNT_PREFIX,
      CNT_AGENT: updateDto.CNT_AGENT,
      CNT_TRADER: updateDto.CNT_TRADER,
    });
  }
}
