import { IsDateString, IsOptional, IsString } from 'class-validator';

export class FinishInspectionDto {
    @IsOptional()
    @IsDateString()
    INSPEC_DATE?: string;

    @IsOptional()
    @IsString()
    UPDATE_BY?: string;
}