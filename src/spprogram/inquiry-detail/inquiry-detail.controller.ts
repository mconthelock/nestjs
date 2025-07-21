import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InquiryDetailService } from './inquiry-detail.service';

@Controller('sp/detail')
export class InquiryDetailController {
  constructor(private readonly dt: InquiryDetailService) {}

  @Get(':id')
  findDetail(@Param('id') id: string) {
    return this.dt.findDetail(id);
  }
}
