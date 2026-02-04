import { Controller, Get } from '@nestjs/common';
import { BusstationService } from './busstation.service';

@Controller('gpreport/busstop')
export class BusstationController {
  constructor(private readonly stop: BusstationService) {}

  @Get()
  findAll() {
    return this.stop.findAll();
  }
}
