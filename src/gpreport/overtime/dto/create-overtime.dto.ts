import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateOvertimeDto {
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

    @IsString()
    EMPNO: string;

    @IsDate()
    @Type(() => Date)
    WORKDATE: Date;

    @IsString()
    TIMEIN: string;

    @IsString()
    TIMEOUT: string;

    @IsString()
    OTJOB: string;

    @IsNumber()
    @Type(() => Number)
    WKTYPENO: number;

    @IsString()
    REMARK: string;

    @IsString()
    FORSECCODE: string;

    @IsString()
    VFILENAME: string;

    @IsString()
    OT3: string;

    @IsString()
    SPECIAL: string;

    @IsString()
    SPECIAL_REASON: string;
}
