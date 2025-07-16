import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { UpdateInquiryDto } from './dto/update-inquiry.dto';

@Controller('sp/inquiry')
export class InquiryController {
  constructor(private readonly inq: InquiryService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inq.findOne(+id);
  }
  @Post()
  create(@Body() CreateInquiryDto: CreateInquiryDto) {
    console.log(CreateInquiryDto);
    return this.inq.create(CreateInquiryDto);
  }
}
