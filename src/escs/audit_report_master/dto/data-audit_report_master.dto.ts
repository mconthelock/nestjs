import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class DataESCSARMDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  rev: number;

  @IsNotEmpty()
  @IsString()
  detail: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  topic: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  new_topic?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  seq?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  new_seq?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  factor?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxScore?: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['edit', 'new', 'del'])
  type: string;
}
