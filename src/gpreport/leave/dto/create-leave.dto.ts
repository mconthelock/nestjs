import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class CreateLeaveDto {
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
    SENDDATE: Date;

    @IsDate()
    @Type(() => Date)
    FRMLVDATE: Date;

    @IsDate()
    @Type(() => Date)
    TOLVDATE: Date;

    @IsString()
    FRMLVTIME: string;

    @IsString()
    TOLVTIME: string;

    @IsNumber()
    @Type(() => Number)
    TYPENO: number;

    @IsString()
    REASON: string;

    @IsString()
    TOTLV: string;

    @IsString()
    NUSED: string;

    @IsString()
    NRIGHT: string;

    @IsString()
    VFILENAME: string;

    @IsString()
    REQTO: string;

    @IsString()
    CAPPROVE: string;
}
