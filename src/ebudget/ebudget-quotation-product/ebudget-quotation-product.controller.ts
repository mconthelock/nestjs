import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbudgetQuotationProductService } from './ebudget-quotation-product.service';

@Controller('ebudget/quotation/product')
export class EbudgetQuotationProductController {
  constructor(private readonly ebudgetQuotationProductService: EbudgetQuotationProductService) {}

}
