import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemMfgHistoryDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NITEMLISTID: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NMARKNUM: number;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  VMARK: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VMARK_REMARK: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VINCHARGE: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  VINCHARGE_REMARK: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  NUSERUPDATE: number;
}
