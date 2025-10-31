import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class searchTagDto {
  @Type(() => String)
  @IsOptional()
  @IsString()
  SCHD: string | null;

  @Type(() => String)
  @IsOptional()
  @IsString()
  SCHDP: string | null;

  @Type(() => String)
  @IsOptional()
  @IsString()
  MFGNO: string | null;
}
