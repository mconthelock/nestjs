import { PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCountryConditionDto {
    @IsNotEmpty()
    @IsString()
    COUNTRY: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    TYPE: number;

    @IsNotEmpty()
    @IsString()
    CREATEBY: string;
}

export class DeleteCountryConditionDto extends PickType(
    CreateCountryConditionDto,
    ['COUNTRY', 'TYPE'] as const,
) {}
