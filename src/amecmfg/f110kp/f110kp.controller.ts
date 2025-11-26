import { Controller } from '@nestjs/common';
import { F110kpService } from './f110kp.service';

@Controller('f110kp')
export class F110kpController {
  constructor(private readonly f110kpService: F110kpService) {}
}
