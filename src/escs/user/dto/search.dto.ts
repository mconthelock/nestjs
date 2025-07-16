import { IsOptional, IsString, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly USR_ID?: number;

  @IsOptional()
  @IsString()
  readonly USR_NO?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly GRP_ID?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly USR_STATUS?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly SEC_ID?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fields?: string[];
}
