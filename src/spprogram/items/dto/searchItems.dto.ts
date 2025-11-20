import { PartialType } from '@nestjs/mapped-types';
import { createItemsDto } from './createItems.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
export class searchItemsDto extends PartialType(createItemsDto) {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  ITEM_ID: number;
}
