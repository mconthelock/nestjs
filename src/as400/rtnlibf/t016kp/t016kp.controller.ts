import { Controller, Get } from '@nestjs/common';
import { T016kpService } from './t016kp.service';

@Controller('as400/t060kp')
export class T016kpController {
  constructor(private readonly t01: T016kpService) {}

  @Get()
  async findOne() {
    const result = await this.t01.findOne();
    return result;
  }
}
