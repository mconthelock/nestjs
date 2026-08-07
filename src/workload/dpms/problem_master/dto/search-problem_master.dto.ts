import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

import { CreateProblemMasterDto } from './create-problem_master.dto';
const OmitInqFields = ['PB_STATUS', 'PRIORITY'] as const;
class SearchBase extends OmitType(CreateProblemMasterDto, OmitInqFields) {}

export class SearchProblemMasterDto extends PartialType(SearchBase) {
    @IsOptional()
    @IsString()
    PRIORITY?: string;

    @IsOptional()
    @IsString()
    PB_STATUS?: string;
}
