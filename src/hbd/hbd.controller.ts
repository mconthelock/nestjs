import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HbdService } from './hbd.service';
import { CreateHbdDto } from './dto/create-hbd.dto';
import { UpdateHbdDto } from './dto/update-hbd.dto';

@Controller('hbd')
export class HbdController {
  constructor(private readonly hbdService: HbdService) {}
  
  @Post('genQR')
  async generateQR() {
    return await this.hbdService.generateQR();
  }
}
