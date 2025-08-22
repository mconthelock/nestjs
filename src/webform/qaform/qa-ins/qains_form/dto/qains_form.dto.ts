import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';
import { PickType, ApiPropertyOptional } from '@nestjs/swagger';
import { SearchQainsFormDto } from './search-qains_form.dto';
export class QainsFormDto extends PickType(SearchQainsFormDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {}
