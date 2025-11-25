import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { createInqDto } from './create-inquiry.dto';
import { createTimelineDto } from '../../timeline/dto/create-dto';
import { createQuotationDto } from '../../quotation/dto/create-quotation.dto';
export class TimelineDto extends PartialType(createTimelineDto) {}
export class QuotationDto extends PartialType(createQuotationDto) {}

const OmitInqFields = ['INQ_STATUS'] as const;
class SearchBase extends OmitType(createInqDto, OmitInqFields) {}

export class searchDto extends PartialType(SearchBase) {
  @IsOptional()
  @IsString()
  INQ_STATUS?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TimelineDto)
  timeline?: TimelineDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => QuotationDto)
  quotation?: QuotationDto;
}
