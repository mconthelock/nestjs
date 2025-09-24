import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';

@Controller('sp/status')
export class StatusController {
  constructor(private readonly status: StatusService) {}

  @Get('all')
  async findAll() {
    return this.status.findAll();
  }
}
