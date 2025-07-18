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

@Controller('quotation-type')
export class QuotationTypeController {
  constructor(private readonly quotationTypeService: QuotationTypeService) {}
}
