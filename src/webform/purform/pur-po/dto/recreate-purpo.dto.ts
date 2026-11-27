import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RecreatePurPoDto {
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
    empno: string;

    @IsOptional()
    @IsString()
    remark?: string;
}
