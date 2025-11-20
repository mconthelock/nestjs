import { PartialType } from '@nestjs/mapped-types';
import { createItemsDto } from './createItems.dto';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
export class updateItemsDto extends PartialType(createItemsDto) {
  @Type(() => Number)
  @IsNumber()
  ITEM_ID: number;
}
