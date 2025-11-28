import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsUrl,
  isString,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

export class PDFOptions {
  @IsOptional()
  @IsString()
  path?: string; // 'output.pdf'

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  displayHeaderFooter?: boolean;

  @IsOptional()
  @IsString()
  headerTemplate?: string;

  @IsOptional()
  @IsString()
  footerTemplate?: string;

  @IsOptional()
  @IsString()
  format?: string; // 'A4'

  @IsOptional()
  @IsString()
  height?: string; // 297mm

  @IsOptional()
  @IsString()
  width?: string; // 210mm

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  landscape?: boolean;

  @IsOptional()
  margin?: { top?: string; right?: string; bottom?: string; left?: string }; // { top: '10mm', right: '8mm', bottom: '12mm', left: '8mm' },

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  outline?: boolean;

  @IsOptional()
  @IsString()
  pageRanges?: string; //e.g., '1-5, 8, 11-13'.

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  preferCSSPageSize?: boolean;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  printBackground?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  scale?: number; // 1.0

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  tagged?: boolean; // true
}

export class createPDFDto {
  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PDFOptions)
  options?: PDFOptions;
}

