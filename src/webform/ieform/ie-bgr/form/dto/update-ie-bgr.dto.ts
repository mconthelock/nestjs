import { PartialType } from '@nestjs/swagger';
import { CreateIeBgrDto } from './create-ie-bgr.dto';
import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateIeBgrDto extends PartialType(CreateIeBgrDto) {}

export class ReportIeBgrDto {
  @IsOptional()
  @IsString()
  @Type(() => String)
  FORMNO: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  DEPT: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  EMPNO: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  FORM_STATUS: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  PONO: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  PRNO: string;
}
