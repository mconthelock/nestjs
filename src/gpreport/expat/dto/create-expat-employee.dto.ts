import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateExpatEmployeeDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(5)
    SEMPNO: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    PASSPORT_NO?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    THAI_ADDR?: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    TELNO?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    EMAIL?: string;

    @IsOptional()
    @IsDateString()
    START_WORK_DATE?: string;

    @IsOptional()
    @IsDateString()
    SINGLE_WIN_DATE?: string;

    @IsOptional()
    @IsDateString()
    VISA_APPT_DATE?: string;

    @IsOptional()
    @IsDateString()
    VISA_EXP_DATE?: string;

    @IsOptional()
    @IsDateString()
    LAST_ARRIVAL_DATE?: string;

    @IsOptional()
    @IsDateString()
    LAST_ARRIVAL_UPD_DATE?: string;

    @IsOptional()
    @IsDateString()
    LAST_90DAY_DATE?: string;

    @IsOptional()
    @IsDateString()
    LAST_90DAY_UPD_DATE?: string;
}