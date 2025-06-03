import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppsusersService } from './appsusers.service';
import { CreateAppsuserDto } from './dto/create-appsuser.dto';
import { UpdateAppsuserDto } from './dto/update-appsuser.dto';

@Controller('appsusers')
export class AppsusersController {
  constructor(private readonly appsusersService: AppsusersService) {}

  @Post()
  create(@Body() createAppsuserDto: CreateAppsuserDto) {
    return this.appsusersService.create(createAppsuserDto);
  }

  @Get()
  findAll() {
    return this.appsusersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appsusersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppsuserDto: UpdateAppsuserDto) {
    return this.appsusersService.update(+id, updateAppsuserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsusersService.remove(+id);
  }
}
