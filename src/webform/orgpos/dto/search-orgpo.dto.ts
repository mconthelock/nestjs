
import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SearchOrgpoDto {
  @IsOptional()
  @IsString()
  readonly VPOSNO?: string;

  @IsOptional()
  @IsString()
  readonly VORGNO?: string;
}
