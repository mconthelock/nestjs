import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
  IsIn,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class SearchJopPurConfDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly JOP_REVISION: number;

  @IsOptional()
  @IsString()
  readonly JOP_MFGNO: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly JOP_PONO: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly JOP_LINENO: number;

  @IsOptional()
  @IsString()
  readonly JOP_PUR_CONFIRM: string;

  @IsOptional()
  @IsString()
  readonly JOP_PUR_CONFIRM_DATE: string;

  @IsOptional()
  @IsString()
  readonly JOP_PUR_INPUT_DATE: string;

  @IsOptional()
  @IsString()
  readonly SCONFDATE?: string;

  @IsOptional()
  @IsString()
  readonly ECONFDATE?: string;

  @IsOptional()
  @IsString()
  readonly SINPUTDATE?: string;

  @IsOptional()
  @IsString()
  readonly EINPUTDATE?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  readonly distinct?: boolean;

  @IsOptional()
  @IsString()
  readonly orderby?: string;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  readonly orderbyDirection?: 'ASC' | 'DESC';
}
