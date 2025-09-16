import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Timeline } from './entities/timeline.entity';
import { createTimelineDto } from './dto/create-dto';
import { updateTimelineDto } from './dto/update-dto';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Timeline, 'spsysConnection')
    private readonly times: Repository<Timeline>,
  ) {}

  async update(req: updateTimelineDto) {
    const data = await this.times.findOneBy({
      INQ_NO: req.INQ_NO,
      INQ_REV: req.INQ_REV,
    });
    if (!data) {
      throw new NotFoundException(`Inquiry timeline is not found`);
    }
    Object.assign(data, req);
    return await this.times.save(data);
  }
}
