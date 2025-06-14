import { Controller, Get, Param } from '@nestjs/common';
import { AppsmenuusersService } from './appsmenuusers.service';

@Controller('appsmenuusers')
export class AppsmenuusersController {
  constructor(private readonly appsmenuusersService: AppsmenuusersService) {}

  @Get('program/:pgm/user/:group')
  getGroup(@Param('pgm') pgm: number, @Param('user') group: number) {
    return this.appsmenuusersService.getUserMenu(+pgm, +group);
  }
}
