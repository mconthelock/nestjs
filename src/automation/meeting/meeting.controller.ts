import { Controller, Post, Body } from '@nestjs/common';
import { MeetingService } from './meeting.service';

@Controller('automate/meeting')
export class MeetingController {
  constructor(private readonly meeting: MeetingService) {}

  @Post('create')
  async create(@Body() body: any[]) {
    return this.meeting.setMeeting(body);
  }
}
