import { Controller, Get } from '@nestjs/common';
import { FowarderService } from './fowarder.service';

@Controller('invoice/fowarder')
export class FowarderController {
  constructor(private readonly fwd: FowarderService) {}

  @Get('all')
  findAll() {
    return this.fwd.findAll();
  }
}
