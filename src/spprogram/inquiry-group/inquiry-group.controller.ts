import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InquiryGroupService } from './inquiry-group.service';
import { CreateInquiryGroupDto } from './dto/create-inquiry-group.dto';
import { UpdateInquiryGroupDto } from './dto/update-inquiry-group.dto';

@Controller('inquiry-group')
export class InquiryGroupController {
  constructor(private readonly inquiryGroupService: InquiryGroupService) {}

  @Post()
  create(@Body() createInquiryGroupDto: CreateInquiryGroupDto) {
    return this.inquiryGroupService.create(createInquiryGroupDto);
  }

  @Get()
  findAll() {
    return this.inquiryGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inquiryGroupService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInquiryGroupDto: UpdateInquiryGroupDto) {
    return this.inquiryGroupService.update(+id, updateInquiryGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inquiryGroupService.remove(+id);
  }
}
