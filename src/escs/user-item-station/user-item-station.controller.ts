import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSUserItemStationService } from './user-item-station.service';
import { ESCSCreateUserItemStationDto } from './dto/create-user-item-station.dto';
import { ESCSUpdateUserItemStationDto } from './dto/update-user-item-station.dto';

@Controller('user-item-station')
export class ESCSUserItemStationController {
  constructor(private readonly userItemStationService: ESCSUserItemStationService) {}

  @Post()
  create(@Body() createUserItemStationDto: ESCSCreateUserItemStationDto) {
    return this.userItemStationService.create(createUserItemStationDto);
  }

  @Get()
  findAll() {
    return this.userItemStationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userItemStationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserItemStationDto: ESCSUpdateUserItemStationDto) {
    return this.userItemStationService.update(+id, updateUserItemStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userItemStationService.remove(+id);
  }
}
