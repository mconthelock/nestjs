import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class SearchMfgEdrTargetMasterDto {
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(9999)
  FYEAR: number;
}