import { Controller, Post, Body } from '@nestjs/common';
import { InquiryDetailService } from './inquiry-detail.service';
import { createDetailDto } from './dto/create.dto';

@Controller('sp/detail')
export class InquiryDetailController {
  constructor(private readonly dt: InquiryDetailService) {}

  @Post('create')
  create(@Body() createDto: createDetailDto) {
    return this.dt.create(createDto);
  }
}
