import { IsArray, IsBoolean, IsEmail, IsOptional, IsString, Matches, ArrayNotEmpty } from 'class-validator';

export class InspectionReminderDto {
    @IsOptional()
    @IsString()
    @Matches(/^\d{2}\/\d{2}\/\d{4}$/)
    date?: string;

    @IsOptional()
    @IsBoolean()
    dryRun?: boolean;

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsEmail({}, { each: true })
    to?: string[];

    // An empty array deliberately disables CC for a test run.
    @IsOptional()
    @IsArray()
    @IsEmail({}, { each: true })
    cc?: string[];
}
