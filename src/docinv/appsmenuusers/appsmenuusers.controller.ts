import { Controller, Get, Param } from '@nestjs/common';
import { AppsmenuusersService } from './appsmenuusers.service';

@Controller('appsmenuusers')
export class AppsmenuusersController {
  constructor(private readonly appsmenuusersService: AppsmenuusersService) {}

  @Get('program/:pgm/group/:group')
  getByGroup(@Param('pgm') pgm: number, @Param('group') group: number) {
    return this.appsmenuusersService.getByGroup(+pgm, +group);
  }
}
