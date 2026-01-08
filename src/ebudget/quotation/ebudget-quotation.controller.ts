import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuotationService } from './ebudget-quotation.service';
import { FormDto } from 'src/webform/form/dto/form.dto';

@Controller('ebudget/quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post('total')
  async getTotal(@Body() dto: FormDto) {
    return await this.quotationService.getTotal(dto);
  }
}
