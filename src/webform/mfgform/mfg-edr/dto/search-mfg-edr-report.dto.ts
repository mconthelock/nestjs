import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchMfgEdrReportDto {
  @IsOptional()
  @IsString()
  REQUEST_BY?: string;

  @IsOptional()
  @IsString()
  DAILY_REPORT_NO?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TID?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  CID?: number;

  @IsOptional()
  @IsString()
  SSECCODE?: string;

  @IsOptional()
  @IsString()
  ORDERNO?: string;

  @IsOptional()
  @IsString()
  DWGNO?: string;

  @IsOptional()
  @IsString()
  ITEM?: string;

  @IsOptional()
  @IsString()
  ISSUE_DATE_FROM?: string;

  @IsOptional()
  @IsString()
  ISSUE_DATE_TO?: string;

  @IsOptional()
  @IsString()
  CST?: string;
}