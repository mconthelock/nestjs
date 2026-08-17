import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Length, Max, Min } from 'class-validator';

export class SearchMfgEdrTargetMasterDto {
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(9999)
  FYEAR: number;

  @IsOptional()
  @IsString()
  @Length(6, 6)
  SSECCODE?: string;
}