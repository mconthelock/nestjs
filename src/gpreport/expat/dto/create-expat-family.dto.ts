import {
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

export class CreateExpatFamilyDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    RELATION: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    FULL_NAME: string;

    @IsOptional()
    @IsString()
    @MaxLength(30)
    PASSPORT_NO?: string;

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

}