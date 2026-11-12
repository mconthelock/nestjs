import { Type } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdatefeotDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PLANYEAR: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    PLANMONTH: number;

    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    SEMPNO: string;

    // วันที่เดิม ใช้เป็นเงื่อนไข WHERE
    @IsNotEmpty()
    @IsDateString()
    OLD_WORKDATE: string;

    // วันที่ใหม่ที่ต้องการ update
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    WORKDATE?: Date;

    @IsOptional()
    @IsString()
    @Type(() => String)
    WORKTIMEIN?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    WORKTIMEOUT?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    WORKHOURS?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    WORKTYPE?: number;

    @IsOptional()
    @IsString()
    @Type(() => String)
    CSTATUS?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    WORKDESC?: string;
}