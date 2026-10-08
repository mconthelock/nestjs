import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, ValidateNested } from 'class-validator';

import { CreateAttendanceDto } from './create-attendance.dto';

export class workAdjust {
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    START_WORKINGDATE?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    END_WORKINGDATE?: Date;

    @IsString()
    @IsOptional()
    SEMPNO?: string;
}

export class SearchAttendanceDto extends PartialType(CreateAttendanceDto) {
    @IsDate()
    @IsOptional()
    @Type(() => Date)
    START_workingdate?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    END_workingdate?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    START_SDATE?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    END_SDATE?: Date;

    @IsString()
    @IsOptional()
    Division?: string;

    @IsString()
    @IsOptional()
    Department?: string;

    @ValidateNested()
    @Type(() => workAdjust)
    workAdjust?: workAdjust;
}
