import { Controller, Get } from '@nestjs/common';
import { F003kpService } from './f003kp.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('f003kp')
export class F003kpController {
  constructor(private readonly f003kpService: F003kpService) {}
}
