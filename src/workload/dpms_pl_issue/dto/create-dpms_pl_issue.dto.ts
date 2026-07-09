import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDpmsPlIssueDto {
    @IsNotEmpty()
    @IsString()
    VPROD: string;

    @IsNotEmpty()
    @IsString()
    VP: string;

    @IsNotEmpty()
    @IsString()
    VORDERS: string;

    @IsNotEmpty()
    @IsString()
    VTYPE: string;

    @IsOptional()
    @IsString()
    VPROBLEM?: string;

    @IsOptional()
    @IsString()
    VREASON?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    DFINISHALL?: Date;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    NDOCREV?: number;
}
