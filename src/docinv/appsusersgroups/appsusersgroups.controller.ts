import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AppsusersgroupsService } from './appsusersgroups.service';
import { CreateAppsusersgroupDto } from './dto/create-appsusersgroup.dto';
import { UpdateAppsusersgroupDto } from './dto/update-appsusersgroup.dto';

@Controller('appsusersgroups')
export class AppsusersgroupsController {
  constructor(private readonly appsusersgroupsService: AppsusersgroupsService) {}

  @Post()
  create(@Body() createAppsusersgroupDto: CreateAppsusersgroupDto) {
    return this.appsusersgroupsService.create(createAppsusersgroupDto);
  }

  @Get()
  findAll() {
    return this.appsusersgroupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appsusersgroupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppsusersgroupDto: UpdateAppsusersgroupDto) {
    return this.appsusersgroupsService.update(+id, updateAppsusersgroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsusersgroupsService.remove(+id);
  }
}
