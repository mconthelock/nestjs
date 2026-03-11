import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserItemService } from './user-item.service';
import { CreateUserItemDto } from './dto/create-user-item.dto';
import { UpdateUserItemDto } from './dto/update-user-item.dto';

@Controller('escs/user-item')
export class UserItemController {
  constructor(private readonly userItemService: UserItemService) {}
}
