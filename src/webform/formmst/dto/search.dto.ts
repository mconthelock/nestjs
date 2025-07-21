import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly NNO?: number;

  @IsOptional()
  @IsString()
  readonly VORGNO?: string;

  @IsOptional()
  @IsString()
  readonly CYEAR?: string;

  @IsOptional()
  @IsString()
  readonly VANAME?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}
