import { Controller, Get } from '@nestjs/common';
import { TmaintaintypeService } from './tmaintaintype.service';

@Controller('mkt/maintain')
export class TmaintaintypeController {
  constructor(private readonly msttype: TmaintaintypeService) {}

  @Get()
  findAll() {
    return this.msttype.findAll();
  }
}
