import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuotationTypeService } from './quotation-type.service';
import { createDto } from './dto/create.dto';

@Controller('sp/quotationtype')
export class QuotationTypeController {
  constructor(private readonly quotype: QuotationTypeService) {}

  @Get()
  findAll() {
    return this.quotype.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quotype.findOne(id);
  }

  @Post('create')
  create(@Body() createDto: createDto) {
    return this.quotype.create(createDto);
  }

  //   @Post()
  //   create(@Body() createQuotationTypeDto: CreateQuotationTypeDto) {
  //     return this.quotype.create(createQuotationTypeDto);
  //   }
}
