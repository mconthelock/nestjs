import { Controller, Get, Param, Post, Body, Delete } from '@nestjs/common';
import { AppsmenuusersService } from './appsmenuusers.service';
import { CreateAppsmenuuserDto } from './dto/create-appsmenuuser.dto';

@Controller('docinv/appauthen')
export class AppsmenuusersController {
  constructor(private readonly appsmenuusersService: AppsmenuusersService) {}

  @Get('program/:pgm/user/:group')
  getGroup(@Param('pgm') pgm: number, @Param('user') group: number) {
    return this.appsmenuusersService.getUserMenu(+pgm, +group);
  }

  @Get('users/:pgm')
  getAllUser(@Param('pgm') pgm: number) {
    return this.appsmenuusersService.getAllUserMenu(+pgm);
  }

  @Post()
  create(@Body() data: CreateAppsmenuuserDto) {
    return this.appsmenuusersService.create(data);
  }

  @Delete(':appid/:menuid/:group')
  remove(
    @Param('appid') appid: number,
    @Param('menuid') menuid: number,
    @Param('group') group: number,
  ) {
    return this.appsmenuusersService.remove(+appid, +menuid, +group);
  }
}
