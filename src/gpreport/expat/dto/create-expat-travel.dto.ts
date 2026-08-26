import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExpatTravelDto {
    @IsOptional()
    @IsString()
    @MaxLength(20)
    FLIGHT_NO?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    FROM_DEST?: string;

    @IsOptional()
    @IsDateString()
    DEPARTURE_DATE?: string;

    @IsNotEmpty()
    @IsDateString()
    ARRIVAL_DATE: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    STATUS?: string;
}