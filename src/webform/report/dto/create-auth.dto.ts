import { Type } from 'class-transformer';
import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
export class CreateReportAuthDto {
    @IsString()
    @IsNotEmpty()
    VEMPNO: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    REPORT: number;

    @IsString()
    @IsNotEmpty()
    CAUTHNO: string;
}
