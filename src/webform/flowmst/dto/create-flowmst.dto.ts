import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFlowmstDto {
    @IsNumber()
    @Type(() => Number)
    NFRMNO: number;

    @IsString()
    VORGNO: string;

    @IsString()
    CYEAR: string;

    @IsString()
    CSTEPNO: string;

    @IsString()
    CSTEPNEXTNO: string;

    @IsString()
    VPOSNO: string;

    @IsString()
    VAPVNO: string;

    @IsString()
    @IsOptional()
    VAPVORGNO?: string;

    @IsString()
    @IsOptional()
    VURL?: string;

    @IsString()
    CSTART: string;

    @IsString()
    CTYPE: string;

    @IsString()
    @IsOptional()
    CEXTDATA?: string;

    @IsString()
    @IsOptional()
    CAPVTYPE?: string;

    @IsString()
    @IsOptional()
    CREJTYPE?: string;

    @IsString()
    @IsOptional()
    CAPPLYALL?: string;
}
