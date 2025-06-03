import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppsgroupsService } from './appsgroups.service';
import { CreateAppsgroupDto } from './dto/create-appsgroup.dto';
import { UpdateAppsgroupDto } from './dto/update-appsgroup.dto';

@Controller('appsgroups')
export class AppsgroupsController {
  constructor(private readonly appsgroupsService: AppsgroupsService) {}

  @Post()
  create(@Body() createAppsgroupDto: CreateAppsgroupDto) {
    return this.appsgroupsService.create(createAppsgroupDto);
  }

  @Get()
  findAll() {
    return this.appsgroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appsgroupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppsgroupDto: UpdateAppsgroupDto) {
    return this.appsgroupsService.update(+id, updateAppsgroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsgroupsService.remove(+id);
  }
}
