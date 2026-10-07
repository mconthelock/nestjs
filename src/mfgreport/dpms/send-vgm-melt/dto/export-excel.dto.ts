import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class ExcelDataDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    LOADNO: number;

    @IsNotEmpty()
    @IsString()
    AMECLOAD: string;

    @IsNotEmpty()
    @IsString()
    CONTAINSIZE: string;

    @IsNotEmpty()
    @IsString()
    PROJECT: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ACTUAL_WEIGHT: number;
}

export class ExportExcelDto {
    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    VANNDATE: Date;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ExcelDataDto)
    DATA: ExcelDataDto[];
}
