import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobOrderService } from './job-order.service';
import { CreateJobOrderDto } from './dto/create-job-order.dto';
import { UpdateJobOrderDto } from './dto/update-job-order.dto';

@Controller('job-order')
export class JobOrderController {
  constructor(private readonly jobOrderService: JobOrderService) {}

  @Post()
  create(@Body() createJobOrderDto: CreateJobOrderDto) {
    return this.jobOrderService.create(createJobOrderDto);
  }

  @Get()
  findAll() {
    return this.jobOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobOrderDto: UpdateJobOrderDto) {
    return this.jobOrderService.update(+id, updateJobOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobOrderService.remove(+id);
  }
}
