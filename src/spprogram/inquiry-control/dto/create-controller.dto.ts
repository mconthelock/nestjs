import { Type } from 'class-transformer';
import { IsString, IsNumber } from 'class-validator';

export class CreateControllerDto {
  @IsString()
  CNT_PREFIX: string;

  @IsString()
  CNT_AGENT: string;

  @IsString()
  CNT_TRADER: string;

  @Type(() => Number)
  @IsNumber()
  CNT_QUOTATION: number;

  @Type(() => Number)
  @IsNumber()
  CNT_TERM: number;

  @Type(() => Number)
  @IsNumber()
  CNT_WEIGHT: number;

  @Type(() => Number)
  @IsNumber()
  CNT_METHOD: number;
}
