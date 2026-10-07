import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';

export class SearchProductionUnitDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  FYEAR: number;
}