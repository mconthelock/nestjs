import { Controller, Post, Body } from '@nestjs/common';
import { InquiryDetailService } from './inquiry-detail.service';
import { createDto } from './dto/create.dto';

@Controller('sp/detail')
export class InquiryDetailController {
  constructor(private readonly dt: InquiryDetailService) {}

  @Post('create')
  create(@Body() createDto: createDto) {
    return this.dt.create(createDto);
  }
}
