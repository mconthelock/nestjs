import { Type } from 'class-transformer';
import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, ValidateNested, IsOptional } from 'class-validator';

import { CreateProblemMasterDto } from './create-problem_master.dto';
import { CreateAmecOrdersScheduleDto } from '../../../amecorders_schedule/dto/create-amecorders_schedule.dto';

export class ScheduleDto extends PartialType(CreateAmecOrdersScheduleDto) {}

const OmitInqFields = [] as const;
class SearchBase extends OmitType(CreateProblemMasterDto, OmitInqFields) {}
export class SearchProblemOrdersDto extends PartialType(SearchBase) {
    @IsOptional()
    @ValidateNested()
    @Type(() => ScheduleDto)
    schedule?: ScheduleDto;
}
