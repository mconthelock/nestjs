import { Controller } from '@nestjs/common';
import { AccesslogService } from './accesslog.service';

@Controller('accesslog')
export class AccesslogController {
  constructor(private readonly accesslogService: AccesslogService) {}
}
