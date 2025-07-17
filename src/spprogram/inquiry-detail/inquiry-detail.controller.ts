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
import { CreateInquiryDetailDto } from './dto/create-inquiry-detail.dto';
import { UpdateInquiryDetailDto } from './dto/update-inquiry-detail.dto';

@Controller('sp/detail')
export class InquiryDetailController {
  constructor(private readonly dt: InquiryDetailService) {}

  @Get(':id')
  findDetail(@Param('id') id: string) {
    return this.dt.findDetail(id);
  }
}
