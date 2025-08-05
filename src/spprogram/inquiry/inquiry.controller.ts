import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { searchDto } from './dto/search.dto';
import { createDto } from './dto/create-inquiry.dto';

@Controller('sp/inquiry')
export class InquiryController {
  constructor(private readonly inq: InquiryService) {}

  @Post('search')
  async search(@Body() searchDto: searchDto) {
    return await this.inq.search(searchDto);
  }

  @Post('create')
  async create(@Body() req: any) {
    const data = await this.inq.create(req.header, req.details);
    //return await this.inq.create(createInquiryDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.inq.findOne(id);
  }
}
