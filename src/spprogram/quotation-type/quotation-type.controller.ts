import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuotationTypeService } from './quotation-type.service';
import { CreateQuotationTypeDto } from './dto/create-quotation-type.dto';
import { UpdateQuotationTypeDto } from './dto/update-quotation-type.dto';

@Controller('quotation-type')
export class QuotationTypeController {
  constructor(private readonly quotationTypeService: QuotationTypeService) {}

  @Post()
  create(@Body() createQuotationTypeDto: CreateQuotationTypeDto) {
    return this.quotationTypeService.create(createQuotationTypeDto);
  }

  @Get()
  findAll() {
    return this.quotationTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotationTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuotationTypeDto: UpdateQuotationTypeDto) {
    return this.quotationTypeService.update(+id, updateQuotationTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quotationTypeService.remove(+id);
  }
}
