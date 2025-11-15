import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';

export class SearchWorkloadDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  PLANYEAR: number;
}
