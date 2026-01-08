import { PartialType } from '@nestjs/mapped-types';
import { createPriceListDto } from './create-price.dto';
export class updatePriceListDto extends PartialType(createPriceListDto) {}
