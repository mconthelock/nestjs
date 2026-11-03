import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, isString, IsString } from "class-validator";

export class CreatefeotDetails {
    @IsNumber()
    @Type(() => Number)
    PLANYEAR: number;

    @IsNumber()
    @Type(() => Number)
    PLANMONTH: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    SEMPNO: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    WORKDATE: Date;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    WORKTIMEIN: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    WORKTIMEOUT: string;

    @IsNumber()
    @Type(() => Number)
    WORKHOURS: number;

    @IsNumber()
    @Type(() => Number)
    WORKTYPE: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    CSTATUS: string;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    WORKDESC: string;

}