import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppsmenuusersService } from './appsmenuusers.service';
import { CreateAppsmenuuserDto } from './dto/create-appsmenuuser.dto';
import { UpdateAppsmenuuserDto } from './dto/update-appsmenuuser.dto';

@Controller('appsmenuusers')
export class AppsmenuusersController {
  constructor(private readonly appsmenuusersService: AppsmenuusersService) {}

  @Post()
  create(@Body() createAppsmenuuserDto: CreateAppsmenuuserDto) {
    return this.appsmenuusersService.create(createAppsmenuuserDto);
  }

  @Get()
  findAll() {
    return this.appsmenuusersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appsmenuusersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppsmenuuserDto: UpdateAppsmenuuserDto) {
    return this.appsmenuusersService.update(+id, updateAppsmenuuserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsmenuusersService.remove(+id);
  }
}
