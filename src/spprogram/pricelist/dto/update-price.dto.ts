import { PartialType } from '@nestjs/mapped-types';
import { createPriceListDto } from './create-price.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
export class updatePriceListDto extends PartialType(createPriceListDto) {}
