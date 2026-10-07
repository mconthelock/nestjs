import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateGpTphArearecordDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    LOCATION_ID: number;

    @IsString()
    @IsNotEmpty()
    AREA_NAME: string;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    AREA_LEVEL: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    AREA_OWNER: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(3)
    AREA_OWNER_POSCODE: string;
}

export class CreateDataAreaDto extends PartialType(CreateGpTphArearecordDto) { }
