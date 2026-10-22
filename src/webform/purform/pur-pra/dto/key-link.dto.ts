import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class KeyLinkDto {
    @IsString()
    @IsOptional()
    PNO?: string;

    @IsNumber()
    @IsOptional()
    PFRMNO?: number;

    @IsString()
    @IsOptional()
    PORGNO?: string;

    @IsString()
    @IsOptional()
    PYEAR?: string;

    @IsString()
    @IsOptional()
    PYEAR2?: string;

    @IsNumber()
    @IsOptional()
    PRUNNO?: number;

    @IsString()
    @IsOptional()
    CNO?: string;

    @IsString()
    @IsOptional()
    CYEAR2?: string;

    @IsNumber()
    @IsOptional()
    CRUNNO?: number;
}
