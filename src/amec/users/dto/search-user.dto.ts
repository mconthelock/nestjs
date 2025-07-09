import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class searchDto {
  @Type(() => String)
  @IsOptional()
  @IsString()
  SEMPNO: string | null;

  @Type(() => String)
  @IsOptional()
  @IsString()
  SSECCODE: string | null;

  @Type(() => String)
  @IsOptional()
  @IsString()
  SDEPCODE: string | null;

  @Type(() => String)
  @IsOptional()
  @IsString()
  SDIVCODE: string | null;

  @Type(() => String)
  @IsOptional()
  @IsString()
  SPOSCODE: string | null;

  @Type(() => String)
  @IsOptional()
  @IsString()
  CSTATUS: string | null;
}
