import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ESCSUserFileService } from './user-file.service';
import { ESCSCreateUserFileDto } from './dto/create-user-file.dto';
import { ESCSUpdateUserFileDto } from './dto/update-user-file.dto';

@Controller('user-file')
export class ESCSUserFileController {
  constructor(private readonly userFileService: ESCSUserFileService) {}
  
}
