import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SearchCauseDto {
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  CAUSE_GROUP: string[];
}