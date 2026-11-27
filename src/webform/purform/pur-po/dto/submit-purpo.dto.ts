import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SubmitPurPoDto {
    @Type(() => Number)
    @IsInt()
    NFRMNO: number;

    @IsString()
    @IsNotEmpty()
    VORGNO: string;

    @IsString()
    @IsNotEmpty()
    CYEAR: string;

    @IsString()
    @IsNotEmpty()
    CYEAR2: string;

    @Type(() => Number)
    @IsInt()
    NRUNNO: number;

    @IsString()
    @IsNotEmpty()
    EMPNO: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    ordAmount?: number;

    @IsOptional()
    @IsString()
    REMARK?: string;
}
