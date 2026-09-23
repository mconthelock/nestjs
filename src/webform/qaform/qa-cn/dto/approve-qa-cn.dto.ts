import { PartialType } from '@nestjs/swagger';
import { RequestCNFormDto } from './request-qa-cn.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ApproveQaCnDto extends PartialType(RequestCNFormDto) {
    @IsNotEmpty()
    @IsString()
    CYEAR2: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    NRUNNO: number;

    @IsNotEmpty()
    @IsString()
    APVNO: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    CEXTDATA?: number;

    @IsOptional()
    @IsString()
    STEPREADY: string;

    @IsOptional()
    @IsString()
    SELJINCHRG: string;

    @IsOptional()
    @IsString()
    SELEINCHRG: string;

    @IsOptional()
    @IsString()
    OPERATOR: string;

    @IsOptional()
    @IsString()
    SELJOBTYPE: string;

    @IsOptional()
    @IsString()
    RADJUDGE: string;

    @IsOptional()
    @IsString()
    TXTJDGOTHER1: string;

    @IsOptional()
    @IsString()
    TXTJDGOTHER2: string;

    @IsOptional()
    @IsString()
    FOREMAN: string;

    @IsOptional()
    @IsString()
    PIC: string;
}
