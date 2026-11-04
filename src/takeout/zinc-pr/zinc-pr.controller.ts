import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZincPrService } from './zinc-pr.service';
import { ZincPrPendingPreviewEmailDto } from './dto/zinc-pr-pending-preview-email.dto';

@Controller('zinc-pr')
export class ZincPrController {
  constructor(private readonly zincPrService: ZincPrService) {}


  @Get('pending')
  findPending() {
    return this.zincPrService.findPending();
  }

  @Post('pending-preview-email')
  sendPendingPreviewEmail(@Body() dto: ZincPrPendingPreviewEmailDto) {
    return this.zincPrService.sendPendingPreviewEmail(dto);
  }

  @Post('submit')
  submitPending() {
    return this.zincPrService.submitPending();
  }
}
