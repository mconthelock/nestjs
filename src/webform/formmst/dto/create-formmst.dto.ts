import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFormmstDto {
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    NNO?: number;

    @IsString()
    VORGNO: string;

    @IsString()
    @IsOptional()
    CYEAR?: string;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    NRUNNO?: number;

    @IsString()
    VNAME: string;

    @IsString()
    VANAME: string;

    @IsString()
    VDESC: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    DCREDATE?: Date;

    @IsString()
    @IsOptional()
    CCRETIME?: string;

    @IsString()
    @IsOptional()
    VAUTHPAGE?: string;

    @IsString()
    VFORMPAGE: string;

    @IsString()
    @IsOptional()
    VDIR?: string;

    @IsNumber()
    @Type(() => Number)
    NLIFETIME: number;

    @IsString()
    @IsOptional()
    CSTATUS?: string;

    @IsString()
    @IsOptional()
    VDEVELOPER?: string;
}
