import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { createInqDto } from './dto/create-inquiry.dto';
import { searchDto } from './dto/search.dto';

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
    return await this.inq.findByNumber(req.header.INQ_NO);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.inq.findOne(id);
  }

  @Post('delete')
  async delete(@Body() searchDto: searchDto) {
    return await this.inq.delete(searchDto);
  }
}
