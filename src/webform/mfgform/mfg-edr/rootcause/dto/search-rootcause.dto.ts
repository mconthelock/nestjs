import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchRootcauseDto {
  @Type(() => Number)
  @IsNumber()
  FYEAR: number;

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  CID?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  SSECCODE?: string[];

  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  ITEM?: number[];

}