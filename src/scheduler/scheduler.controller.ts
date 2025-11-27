import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { CreateJobDto } from './dto/create-scheduler.dto';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  // 1. สร้าง Job ใหม่ (Frontend เรียกเส้นนี้)
  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.schedulerService.createJob(createJobDto);
  }

  // 2. ดูรายชื่อ Job ทั้งหมด
  @Get('jobs')
  findAllJobs() {
    return this.schedulerService.findAllJobs();
  }

  // 3. ดู Logs (รองรับการ Filter ตาม jobId)
  @Get('logs')
  getLogs(@Query('jobId') jobId?: string) {
    return this.schedulerService.getLogs(jobId);
  }

  // 4. สั่งรัน Job ทันที (Manual Trigger)
  @Post(':id/run')
  manualRun(@Param('id') id: string) {
    return this.schedulerService.manualTrigger(id);
  }
}
