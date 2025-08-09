import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { createAttDto } from './create.dto';

export class searchAttDto extends createAttDto {
  @IsString()
  @IsOptional()
  FILE_ACTION?: string;
}
