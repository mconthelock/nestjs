import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateMatrixEffectItemDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  ITEM_ID: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  EFFECT_ID: number;

  @IsNotEmpty()
  @IsString()
  USERCREATE: string;
}

export class MigrationMatrixItemEffectDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMatrixEffectItemDto)
  data: CreateMatrixEffectItemDto[];
}
