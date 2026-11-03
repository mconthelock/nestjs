import { Controller } from '@nestjs/common';
import { Q141kpService } from './q141kp.service';

@Controller('q141kp')
export class Q141kpController {
  constructor(private readonly q141kpService: Q141kpService) {}
}
