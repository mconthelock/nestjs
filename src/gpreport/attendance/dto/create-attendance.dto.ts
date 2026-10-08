import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
    @IsDate()
    @Type(() => Date)
    datetimes: Date;

    @IsString()
    users: string;

    @IsString()
    FirstName: string;

    @IsString()
    Lastname: string;

    @IsString()
    FunctionKeyCode: string;

    @IsDate()
    @Type(() => Date)
    workingdate: Date;

    @IsDate()
    @Type(() => Date)
    SDATE: Date;

    @IsString()
    STIME: string;

    @IsString()
    REMARK: string;

    @IsString()
    RECODE: string;
}
