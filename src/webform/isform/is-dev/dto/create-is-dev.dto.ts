import {
    IsString,
    IsNumber,
    IsDate,
    ValidateNested,
    IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

import { CreateBenefitDto } from './create-benefit.dto';
import { CreateManhoursDto } from './create-manhours.dto';
import { CreateInvestDto } from './create-invest.dto';

export class CreateIsDevDto extends PickType(CreateFormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'REQBY',
    'DRAFT',
    'INPUTBY',
    'REMARK',
] as const) {
    @IsNumber()
    @Type(() => Number)
    NFRMNO: number;

    @IsString()
    VORGNO: string;

    @IsString()
    @Type(() => String)
    CYEAR: string;

    @IsOptional()
    @IsString()
    CYEAR2?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NRUNNO?: number;

    @IsNumber()
    @Type(() => Number)
    OBJECTIVE: number;

    @IsString()
    OBJECTIVE_OTHER: string;

    @IsNumber()
    @Type(() => Number)
    CATEGORY: number;

    @IsNumber()
    @Type(() => Number)
    JOBTYPE: number;

    @IsNumber()
    @Type(() => Number)
    STATUS: number;

    @IsNumber()
    @Type(() => Number)
    PLANYEAR: number;

    @IsString()
    SYSTEMNAME: string;

    @IsString()
    TITLE: string;

    @IsString()
    REQ_ORG: string;

    @IsString()
    REQ_PIC: string;

    @IsDate()
    @Type(() => Date)
    REQ_DATE: Date;

    @IsDate()
    @Type(() => Date)
    SPEC_CONFIRM_PLAN: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    SPEC_CONFIRM_ACTUAL?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DEV_START_PLAN?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DEV_END_PLAN?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DEV_START_ACTUAL?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DEV_END_ACTUAL?: Date;

    @IsOptional()
    @IsOptional()
    @IsString()
    IS_ITGC?: string;

    @IsString()
    PURPOSE: string;

    @IsString()
    @IsOptional()
    CURRENT_WORKFLOW?: string;

    @IsString()
    @IsOptional()
    EXPECTED_WORKFLOW?: string;

    @IsOptional()
    @IsString()
    SYSTEM_TYPE?: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateBenefitDto)
    benefit?: CreateBenefitDto[];

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateManhoursDto)
    manhours?: CreateManhoursDto[];

    @IsOptional()
    @ValidateNested()
    @Type(() => CreateInvestDto)
    invest?: CreateInvestDto[];
}
