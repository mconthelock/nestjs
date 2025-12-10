import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';
export class SearchIsFileDto extends PickType(FormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  FILE_ID?: number;
}
