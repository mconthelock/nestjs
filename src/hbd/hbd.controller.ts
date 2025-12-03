import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HbdService } from './hbd.service';
import { ExcelHbdDto } from './dto/hbd.dto';

@Controller('hbd')
export class HbdController {
  constructor(private readonly hbdService: HbdService) {}
  
  @Post('genQR')
  async generateQR() {
    return await this.hbdService.generateQR();
  }

  @Get('sendReport')
  async sendReport(@Body() dto: ExcelHbdDto) {
    return await this.hbdService.sendReport(dto);
  }
}
