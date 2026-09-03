import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { CreateDpmsPlIssueDto } from 'src/workload/dpms_pl_issue/dto/create-dpms_pl_issue.dto';

export class CreateDpmsPlDocRevDto extends PickType(CreateDpmsPlIssueDto, [
    'VPROD',
    'VP',
    'VORDERS',
    'VTYPE',
] as const) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NISSUEREV_ID: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NREV: number;

    @IsOptional()
    @IsString()
    VREVTEXT?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DFINISHALL?: Date;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NPOID?: number;
}

export class SearchDpmsPlDocRevDto extends PickType(CreateDpmsPlDocRevDto, [
    'VPROD',
    'VP',
    'VORDERS',
    'VTYPE',
    'NREV',
] as const) {}
