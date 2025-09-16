import { Controller, Param, Post, Body, Patch } from '@nestjs/common';
import { TimelineService } from './timeline.service';

import { createTimelineDto } from './dto/create-dto';
import { updateTimelineDto } from './dto/update-dto';

@Controller('sp/timeline')
export class TimelineController {
  constructor(private readonly times: TimelineService) {}

  @Patch()
  async update(@Body() req: updateTimelineDto) {
    return await this.times.update(req);
  }
}
