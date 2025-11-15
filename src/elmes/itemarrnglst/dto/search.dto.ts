import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDate,
  IsOptional,
} from 'class-validator';
export class SearchElmesItemarrnglstDto {
  @IsString()
  @IsNotEmpty()
  ordno!: string;

  @IsString()
  @IsOptional()
  item?: string;
}
