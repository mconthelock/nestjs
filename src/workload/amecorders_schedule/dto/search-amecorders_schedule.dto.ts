import { PartialType, OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';
import { CreateAmecOrdersScheduleDto } from './create-amecorders_schedule.dto';
const OmitInqFields = [] as const;
class SearchBase extends OmitType(CreateAmecOrdersScheduleDto, OmitInqFields) {}

export class SearchAmecOrdersScheduleDto extends PartialType(SearchBase) {}
