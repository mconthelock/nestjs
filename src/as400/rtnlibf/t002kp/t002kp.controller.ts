import { Controller } from '@nestjs/common';
import { T002kpService } from './t002kp.service';

@Controller('t002kp')
export class T002kpController {
  constructor(private readonly t002kpService: T002kpService) {}
}
