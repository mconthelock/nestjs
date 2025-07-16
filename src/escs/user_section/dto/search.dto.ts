import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDto {
  @IsOptional()
  @Type(() => Number) // <-- ใช้ของ class-transformer เท่านั้น
  @IsNumber()
  readonly SEC_ID?: number;

  @IsOptional()
  @IsString()
  readonly SEC_NAME?: string;

  @IsOptional()
  @Type(() => Number) // <-- ใช้ของ class-transformer เท่านั้น
  @IsNumber()
  readonly SEC_STATUS?: number;

  @IsOptional()
  @IsString()
  readonly INCHARGE?: string;
}