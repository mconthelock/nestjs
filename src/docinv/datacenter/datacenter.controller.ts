import { Controller, Get } from '@nestjs/common';
import { DatacenterService } from './datacenter.service';

@Controller('docinv/datacenter')
export class DatacenterController {
  constructor(private readonly table: DatacenterService) {}

  @Get('tablelist')
  tablelist() {
    return this.table.findAll();
  }
}
