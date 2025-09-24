import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSItemStationService } from './item-station.service';
import { CreateESCSItemStationDto } from './dto/create-item-station.dto';
import { UpdateESCSItemStationDto } from './dto/update-item-station.dto';

@Controller('escs/item-station')
export class ESCSItemStationController {
  constructor(private readonly itemStationService: ESCSItemStationService) {}

  @Post('searchItemStation')
    async searchItemStation(@Body() dto: any ) {
      return this.itemStationService.searchItemStation(dto);
    }

}
