import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PickType } from '@nestjs/swagger';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { Column } from 'typeorm';

export class CreateYearlyFormDto {
    @IsNumber()
    @IsNotEmpty()
    ID: number;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    CUTOFF_DATE: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    CHECK_DATE: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    FIN_DATE: Date;

    @IsNumber()
    @IsNotEmpty()
    BULK_ITEM: number;

    @IsNumber()
    @IsNotEmpty()
    BULK_AMOUNT: number;

    @IsNumber()
    @IsNotEmpty()
    STOCK_ITEM: number;

    @IsNumber()
    @IsNotEmpty()
    STOCK_AMOUNT: number;

    @IsString()
    @IsNotEmpty()
    REQBY: string;

    @IsString()
    @IsNotEmpty()
    INPUTBY: string;
}

