import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSUserAuthorizeService } from './user-authorize.service';
import { ESCSCreateUserAuthorizeDto } from './dto/create-user-authorize.dto';
import { ESCSUpdateUserAuthorizeDto } from './dto/update-user-authorize.dto';

@Controller('user-authorize')
export class ESCSUserAuthorizeController {
  constructor(private readonly userAuthorizeService: ESCSUserAuthorizeService) {}

}
