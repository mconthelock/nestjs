import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { createPriceListDto } from './create-price.dto';

export class updatePriceListDto extends PartialType(createPriceListDto) {
    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    PRICE_ID?: number;
}
