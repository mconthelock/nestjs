import { Controller, Param, Get } from '@nestjs/common';
import { AppsusersService } from './appsusers.service';

@Controller('docinv/appsusers')
export class AppsusersController {
  constructor(private readonly users: AppsusersService) {}

  @Get('/user/:id')
  async getUserApp(@Param('id') id: string) {
    return this.users.getUserApp(id);
  }
}
