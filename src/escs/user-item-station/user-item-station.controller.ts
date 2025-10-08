import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSUserItemStationService } from './user-item-station.service';
import { ESCSCreateUserItemStationDto } from './dto/create-user-item-station.dto';
import { ESCSUpdateUserItemStationDto } from './dto/update-user-item-station.dto';

@Controller('escs/user-item-station')
export class ESCSUserItemStationController {
  constructor(private readonly userItemStationService: ESCSUserItemStationService) {}
}
