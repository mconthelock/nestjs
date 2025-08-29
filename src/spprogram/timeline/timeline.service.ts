import { Timeline } from './entities/timeline.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(Timeline, 'spsysConnection')
    private readonly timelineRepository: Repository<Timeline>,
  ) {}
}
