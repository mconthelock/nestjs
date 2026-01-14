import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbudgetQuotationService } from './ebudget-quotation.service';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('ebudget/quotation')
export class EbudgetQuotationController {
  constructor(private readonly ebudgetQuotationService: EbudgetQuotationService) {}

  @Post('data')
  async getData(@Body() formDto: FormDto) {
    return this.ebudgetQuotationService.getData(formDto);
  }
}
