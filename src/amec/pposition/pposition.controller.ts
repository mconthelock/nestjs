import { Controller, Get } from '@nestjs/common';
import { PpositionService } from './pposition.service';

@Controller('pposition')
export class PpositionController {
  constructor(private readonly spos: PpositionService) {}

  @Get('all')
  findAll() {
    return this.spos.findAll();
  }
}
