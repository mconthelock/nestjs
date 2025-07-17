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
import { CreateQuotationTypeDto } from './dto/create-quotation-type.dto';
import { UpdateQuotationTypeDto } from './dto/update-quotation-type.dto';

@Controller('quotation-type')
export class QuotationTypeController {
  constructor(private readonly quotationTypeService: QuotationTypeService) {}
}
