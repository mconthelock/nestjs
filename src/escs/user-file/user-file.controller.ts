import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersFileService } from './user-file.service';
import { CreateUsersFileDto } from './dto/create-user-file.dto';
import { UpdateUsersFileDto } from './dto/update-user-file.dto';

@Controller('escs/user-file')
export class UsersFileController {
  constructor(private readonly userFileService: UsersFileService) {}
  
}
