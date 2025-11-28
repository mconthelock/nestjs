import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { CreateJobDto } from './dto/create-scheduler.dto';
import { UpdateSchedulerDto } from './dto/update-scheduler.dto';
import { SearchSchedulerDto } from './dto/search-scheduler.dto';

@Controller('scheduler')
export class SchedulerController {
  constructor(private readonly schedulerService: SchedulerService) {}

  @Post('create')
  create(@Body() createJobDto: CreateJobDto) {
    return this.schedulerService.createJob(createJobDto);
  }

  @Post('update')
  update(@Body() updateJobDto: UpdateSchedulerDto) {
    return this.schedulerService.updateJob(updateJobDto);
  }

  @Get('jobs')
  findAllJobs() {
    return this.schedulerService.findAllJobs();
  }

  @Post('run')
  manualRun(@Body() data: UpdateSchedulerDto) {
    return this.schedulerService.manualTrigger(data.ID);
  }

  @Post('logs')
  getLogs(@Body() data: SearchSchedulerDto) {
    return this.schedulerService.getLogs(data);
  }
}
