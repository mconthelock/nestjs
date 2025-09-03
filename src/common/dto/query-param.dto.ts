import { IsOptional, IsArray, IsString, IsBoolean, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryParamsDto {
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