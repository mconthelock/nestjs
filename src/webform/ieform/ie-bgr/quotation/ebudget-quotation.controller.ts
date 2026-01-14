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

@Controller('ieform/ie-bgr/quotation')
export class QuotationController {
  constructor(private readonly quotationService: QuotationService) {}

  @Post('total')
  async getTotal(@Body() dto: FormDto) {
    return await this.quotationService.getTotal(dto);
  }

  @Post('data')
  async getData(@Body() dto: FormDto) {
    return await this.quotationService.getData(dto);
  }
}
