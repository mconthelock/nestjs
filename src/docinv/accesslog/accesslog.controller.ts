import { Controller, Get, Param } from '@nestjs/common';
import { AccesslogService } from './accesslog.service';

@Controller('docinv/applogs')
export class AccesslogController {
  constructor(private readonly logs: AccesslogService) {}

  @Get('login/:id')
  async getLoginLogs(@Param('id') id: number) {
    return this.logs.getLoginLogs(id);
  }
}
