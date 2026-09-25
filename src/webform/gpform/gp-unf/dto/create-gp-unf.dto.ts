import { IsString, IsNumber, IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGpUnfFormDto {
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
    REQUEST_TYPE: string;

    @IsString()
    JOB: string;

    @IsString()
    ATTACH_FILE: string;

    @IsString()
    EMP_INPUT: string;

    @IsString()
    EMP_REQUEST: string;

    @IsDate()
    @Type(() => Date)
    CREATE_DATE: Date;

    @IsString()
    ADDRESS: string;

    @IsString()
    AGREE_SARARY: string;

    @IsString()
    CONFIRMED: string;
}

export class CreateGpUnfDetailDto {
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

    @IsNumber()
    @Type(() => Number)
    URD_ID: number;

    @IsNumber()
    @Type(() => Number)
    UNIFORM_CATEGORY: number;

    @IsNumber()
    @Type(() => Number)
    UNIFORM_TYPE: number;

    @IsNumber()
    @Type(() => Number)
    UNIFORM_OLD_TYPE: number;

    @IsNumber()
    @Type(() => Number)
    QTY: number;

    @IsNumber()
    @Type(() => Number)
    REQUEST_TYPE: number;
}

export class CreateGpUnfDto {
    @ValidateNested()
    @Type(() => CreateGpUnfFormDto)
    unfform: CreateGpUnfFormDto;

    @ValidateNested()
    @Type(() => CreateGpUnfDetailDto)
    unfdetails: CreateGpUnfDetailDto[];
}
