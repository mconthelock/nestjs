import { Type } from 'class-transformer';
import { IsString, IsOptional, ValidateNested } from 'class-validator';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { createInqDto } from './create-inquiry.dto';
import { createTimelineDto } from '../../timeline/dto/create-dto';
import { createQuotationDto } from '../../quotation/dto/create-quotation.dto';
import { createDetailDto } from '../../inquiry-detail/dto/create.dto';
export class TimelineDto extends PartialType(createTimelineDto) {}
export class QuotationDto extends PartialType(createQuotationDto) {}
export class DetailDto extends PartialType(createDetailDto) {}

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

  @IsOptional()
  @ValidateNested()
  @Type(() => DetailDto)
  details?: DetailDto;

  @IsOptional()
  IS_ORDERS?: string;

  @IsOptional()
  IS_DETAILS?: string;

  @IsOptional()
  IS_QUOTATION?: string;

  @IsOptional()
  IS_TIMELINE?: string;

  @IsOptional()
  IS_FIN?: string;

  @IsOptional()
  IS_GROUP?: string;

  @IsOptional()
  IS_WEIGHT?: string;
}
