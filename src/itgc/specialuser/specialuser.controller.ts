import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpecialuserService } from './specialuser.service';
import { CreateSpecialuserDto } from './dto/create-specialuser.dto';
import { UpdateSpecialuserDto } from './dto/update-specialuser.dto';

@Controller('itgc/specialuser')
export class SpecialuserController {
  constructor(private readonly specialuserService: SpecialuserService) {}

  @Get('getServerName')
  async getServerName() {
    return this.specialuserService.getServerName();
  }
  
  @Get('getUserLogin')
  async getUserLogin() {
    return this.specialuserService.getUserLogin();
  }

  @Get('getController')
  async getController() {
    return this.specialuserService.getController();
  }

}
