import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

import { CreateAttendanceDto } from './create-attendance.dto';
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
}
