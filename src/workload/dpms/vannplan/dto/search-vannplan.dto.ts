import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

import { CreateVannplanDto } from './create-vannplan.dto';
const OmitInqFields = ['ORDERTYPE'] as const;
class SearchBase extends OmitType(CreateVannplanDto, OmitInqFields) {}

export class SearchVannplanDto extends PartialType(SearchBase) {}
