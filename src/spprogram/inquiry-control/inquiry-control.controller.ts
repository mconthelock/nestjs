import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InquiryControlService } from './inquiry-control.service';
import { CreateInquiryControlDto } from './dto/create-inquiry-control.dto';
import { UpdateInquiryControlDto } from './dto/update-inquiry-control.dto';

@Controller('inquiry-control')
export class InquiryControlController {
  constructor(private readonly inquiryControlService: InquiryControlService) {}

  @Post()
  create(@Body() createInquiryControlDto: CreateInquiryControlDto) {
    return this.inquiryControlService.create(createInquiryControlDto);
  }

  @Get()
  findAll() {
    return this.inquiryControlService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiryControlService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInquiryControlDto: UpdateInquiryControlDto) {
    return this.inquiryControlService.update(+id, updateInquiryControlDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiryControlService.remove(+id);
  }
}
