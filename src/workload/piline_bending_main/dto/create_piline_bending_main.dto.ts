import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString,} from 'class-validator';

export class CreatePilineBendingMainDto {
  @IsNotEmpty()
  @IsString()
  IDTAG: string;

  @IsOptional()
  @IsString()
  TYPE?: string;

  @IsOptional()
  @IsString()
  SHEET_COLOR?: string;

  @IsOptional()
  @IsString()
  ITEM?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  AT?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  BT?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  AM?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  BM?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  AL?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  BL?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TA1?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TA2?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TA3?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TA4?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TB1?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TB2?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TB3?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TB4?: number;

  @IsOptional()
  @Type(() => Date)
  RECORD_DATE?: Date;

  @IsOptional()
  @IsString()
  RECORD_BY?: string;
}