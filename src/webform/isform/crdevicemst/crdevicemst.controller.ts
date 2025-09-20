import { Controller, Get } from '@nestjs/common';
import { CrdevicemstService } from './crdevicemst.service';

@Controller('form/isform/devicemst')
export class CrdevicemstController {
  constructor(private readonly device: CrdevicemstService) {}

  @Get('all')
  findAll() {
    return this.device.findAll();
  }
}
