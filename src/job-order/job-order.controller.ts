import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobOrderService } from './job-order.service';
import { CreateJobOrderDto } from './dto/create-job-order.dto';
import { UpdateJobOrderDto } from './dto/update-job-order.dto';
import { SearchJobOrderDto } from './dto/search-job-order.dto';

@Controller('job-order')
export class JobOrderController {
  constructor(private readonly jobOrderService: JobOrderService) {}

 
  @Get()
  findAll() {
    return this.jobOrderService.findAll();
  }

  @Get(':PRNO')
  findOne(@Param('PRNO') PRNO: number) {
    return this.jobOrderService.findOne(PRNO);
  }

  @Post('search')
  async search(@Body() dto: SearchJobOrderDto) {
    // dto จะเก็บค่าที่ client post มา (body) เช่น { keyword: "แจ๊บ", date: "2024-06-03" }
    return this.jobOrderService.search(dto);
  }
}
