import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EbudgetQuotationService } from './ebudget-quotation.service';

@Controller('ebudget-quotation')
export class EbudgetQuotationController {
  constructor(private readonly ebudgetQuotationService: EbudgetQuotationService) {}
}
