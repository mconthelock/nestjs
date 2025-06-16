import { Controller, Get } from '@nestjs/common';
import { AppsusersService } from './appsusers.service';

@Controller('docinv/appsusers')
export class AppsusersController {
  constructor(private readonly users: AppsusersService) {}
}
