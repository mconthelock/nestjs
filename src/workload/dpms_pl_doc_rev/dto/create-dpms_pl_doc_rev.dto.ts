import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NREV?: number;

    @IsOptional()
    @IsString()
    VREVTEXT?: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    DFINISHALL: Date;
}

export class SearchDpmsPlDocRevDto extends PickType(CreateDpmsPlDocRevDto, [
    'VPROD',
    'VP',
    'VORDERS',
    'VTYPE',
    'NREV',
] as const) {}
