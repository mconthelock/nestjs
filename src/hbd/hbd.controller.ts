import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HbdService } from './hbd.service';
import { ExcelHbdDto, HbdDto, SendQRManualDto } from './dto/hbd.dto';

@Controller('hbd')
export class HbdController {
  constructor(private readonly hbdService: HbdService) {}
  
  @Post('sendQR')
  async sendQR(@Body() dto: HbdDto) {
    return await this.hbdService.sendQR(true, true, true, dto.month);
  }

  // manual resend QR
  @Post('resendQR')
  async resendQR() {
    return await this.hbdService.sendQR(false, true, false);
  }

  // manual insert to sheet
  @Post('reInsertToSheet')
    async reInsertToSheet() {
    return await this.hbdService.sendQR(true, false, false);
  }


  @Post('sendQRManual')
  async sendQRManual(@Body() dto: SendQRManualDto) {
    return await this.hbdService.sendQRManual(dto);
  }

  @Post('sendReport')
  async sendReport(@Body() dto: ExcelHbdDto) {
    return await this.hbdService.sendReport(dto);
  }
}
