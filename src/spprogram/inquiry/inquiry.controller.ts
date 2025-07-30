import { Controller, Post, Body } from '@nestjs/common';
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
  async create(@Body() createInquiryDto: any) {
    return await this.inq.create(createInquiryDto);
  }
}
