import { Controller, Get, Post } from '@nestjs/common';
import { ZincPrService } from './zinc-pr.service';

@Controller('zinc-pr')
export class ZincPrController {
  constructor(private readonly zincPrService: ZincPrService) {}


  @Get('pending')
  findPending() {
    return this.zincPrService.findPending();
  }

  @Post('submit')
  submitPending() {
    return this.zincPrService.submitPending();
  }
}
