import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppsmenuService } from './appsmenu.service';
import { CreateAppsmenuDto } from './dto/create-appsmenu.dto';
import { UpdateAppsmenuDto } from './dto/update-appsmenu.dto';

@Controller('appsmenu')
export class AppsmenuController {
  constructor(private readonly appsmenuService: AppsmenuService) {}

  @Post()
  create(@Body() createAppsmenuDto: CreateAppsmenuDto) {
    return this.appsmenuService.create(createAppsmenuDto);
  }

  @Get()
  findAll() {
    return this.appsmenuService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appsmenuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppsmenuDto: UpdateAppsmenuDto) {
    return this.appsmenuService.update(+id, updateAppsmenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsmenuService.remove(+id);
  }
}
