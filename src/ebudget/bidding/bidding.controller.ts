import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BiddingService } from './bidding.service';
import { SearchEbudgetBiddingDto } from './dto/search-bidding.dto';
@Controller('ebudget/bidding')
export class BiddingController {
  constructor(private readonly biddingService: BiddingService) {}

  @Get()
  findAll() {
    return this.biddingService.findAll();
  }

  @Post('getDataBidding')
  async getDataBidding(@Body() dto: SearchEbudgetBiddingDto) {
    return await this.biddingService.getDataBidding(dto);
  }
}
