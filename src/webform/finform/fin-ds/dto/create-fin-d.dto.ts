import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,IsDate
} from 'class-validator';

import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,IsDate
} from 'class-validator';

import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';

export class CreateFinDDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    LINE_ID: number;
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    LINE_ID: number;

    @IsNotEmpty()
    @IsString()
    REASON: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    DUTY_VALUE: number;
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    DUTY_VALUE: number;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    QTY: number;
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    QTY: number;
}

export class CreateFinDFormdto extends PickType(CreateFormDto, [
export class CreateFinDFormdto extends PickType(CreateFormDto, [
    'INPUTBY',
    'REQBY',
    'REMARK',
] as const) {
] as const) {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => String(value))
    @Transform(({ value }) => String(value))
    OPTION_CODE: string;

      @IsNotEmpty()
      @IsNotEmpty()
    @IsDate()
    @Type(()=> Date)
    EFFECTIVE_DATE: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(()=> Date)
    DATE_RECEIVE: Date;



    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => String(value))
    @Transform(({ value }) => String(value))
    LOCATION: string;

    /*@IsArray()
    /*@IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateFinDDto)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }

        return value;
    })*/
   @IsNotEmpty()
    @Type(() => CreateFinDDto)
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }

        return value;
    })*/
   @IsNotEmpty()
    DATA: CreateFinDDto[];
}