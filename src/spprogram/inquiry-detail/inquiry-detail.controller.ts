import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InquiryDetailService } from './inquiry-detail.service';
import { CreateInquiryDetailDto } from './dto/create-inquiry-detail.dto';
import { UpdateInquiryDetailDto } from './dto/update-inquiry-detail.dto';

@Controller('inquiry-detail')
export class InquiryDetailController {
  constructor(private readonly inquiryDetailService: InquiryDetailService) {}

  @Post()
  create(@Body() createInquiryDetailDto: CreateInquiryDetailDto) {
    return this.inquiryDetailService.create(createInquiryDetailDto);
  }

  @Get()
  findAll() {
    return this.inquiryDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiryDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInquiryDetailDto: UpdateInquiryDetailDto) {
    return this.inquiryDetailService.update(+id, updateInquiryDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiryDetailService.remove(+id);
  }
}
