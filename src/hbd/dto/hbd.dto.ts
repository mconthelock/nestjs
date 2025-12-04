import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class HbdDto {
  @IsOptional()
  @IsString()
  @Length(2, 2) // 01-12
  month: string;
}

export class ExcelHbdDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  month: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  empno: string;
}

export class SendQRManualDto {
  @IsNotEmpty()
  @IsString()
  empno: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return false;
  })
  @IsBoolean()
  insert: boolean;
}
