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

export class SearchJopMarReqDto {
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
  @Type(() => Number)
  @IsNumber()
  readonly JOP_PUR_STATUS: number;

  @IsOptional()
  @IsString()
  readonly JOP_MAR_REQUEST: string;

  @IsOptional()
  @IsString()
  readonly JOP_MAR_REQUEST_DATE: string;

  @IsOptional()
  @IsString()
  readonly JOP_MAR_INPUT_DATE: string;

  @IsOptional()
  @IsString()
  readonly SREQDATE?: string;

  @IsOptional()
  @IsString()
  readonly EREQDATE?: string;

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
