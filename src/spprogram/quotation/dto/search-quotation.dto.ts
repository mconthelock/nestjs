import { Type } from 'class-transformer';
import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { createQuotationDto } from './create-quotation.dto';

export class searchQuotationDto extends PartialType(createQuotationDto) {}
