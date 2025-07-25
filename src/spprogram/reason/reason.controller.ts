import { Controller, Get } from '@nestjs/common';
import { ReasonService } from './reason.service';

@Controller('sp/reason')
export class ReasonController {
  constructor(private readonly reason: ReasonService) {}

  @Get()
  findAll() {
    return this.reason.findAll();
  }
}
