import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PprbiddingService } from './pprbidding.service';
import { CreatePprbiddingDto } from './dto/create-pprbidding.dto';
import { UpdatePprbiddingDto } from './dto/update-pprbidding.dto';

@Controller('amec/pprbidding')
export class PprbiddingController {
  constructor(private readonly pprbiddingService: PprbiddingService) {}

  @Post()
  create(@Body() createPprbiddingDto: CreatePprbiddingDto) {
    return this.pprbiddingService.create(createPprbiddingDto);
  }

  @Get()
  findAll() {
    return this.pprbiddingService.findAll();
  }

  @Post('search')
  search(@Body() dto: UpdatePprbiddingDto) {
    return this.pprbiddingService.search(dto);
  }
}
