import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    Max,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateGpTphArearecordDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    LOCATION_ID: number;

    @IsString()
    @IsNotEmpty()
    AREA_NAME: string;

    @IsNumber()
    @IsInt()
    @Min(0)
    @Max(4)
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
