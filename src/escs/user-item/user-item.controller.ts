import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSUserItemService } from './user-item.service';
import { ESCSCreateUserItemDto } from './dto/create-user-item.dto';
import { ESCSUpdateUserItemDto } from './dto/update-user-item.dto';

@Controller('escs/user-item')
export class ESCSUserItemController {
  constructor(private readonly userItemService: ESCSUserItemService) {}
}
