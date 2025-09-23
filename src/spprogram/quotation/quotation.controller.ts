import { Body, Controller, Post } from '@nestjs/common';
import { QuotationService } from './quotation.service';
import { createQuotationDto } from './dto/create-quotation.dto';
import { searchQuotationDto } from './dto/search-quotation.dto';

@Controller('sp/quotation')
export class QuotationController {
  constructor(private readonly quo: QuotationService) {}

  @Post('create')
  createQuotation(@Body() data: createQuotationDto) {
    return this.quo.createQuotation(data);
  }
}
