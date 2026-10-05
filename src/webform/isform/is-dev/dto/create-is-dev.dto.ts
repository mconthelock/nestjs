import { IsString, IsNumber, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIsDevDto {
    @IsNumber()
    @Type(() => Number)
    NFRMNO: number;

    @IsString()
    VORGNO: string;

    @IsString()
    CYEAR: string;

    @IsString()
    CYEAR2: string;

    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;

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

    @IsDate()
    @Type(() => Date)
    SPEC_CONFIRM_ACTUAL: Date;

    @IsDate()
    @Type(() => Date)
    DEV_START_PLAN: Date;

    @IsDate()
    @Type(() => Date)
    DEV_END_PLAN: Date;

    @IsDate()
    @Type(() => Date)
    DEV_START_ACTUAL: Date;

    @IsDate()
    @Type(() => Date)
    DEV_END_ACTUAL: Date;

    @IsString()
    IS_ITGC: string;

    @IsString()
    PURPOSE: string;

    @IsString()
    CURRENT_WORKFLOW: string;

    @IsString()
    EXPECTED_WORKFLOW: string;
}
