import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';
export class CreatePurVmmScmusrDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    ID: number;

    @IsOptional()
    @IsString()
    NAME?: string;

    @IsNotEmpty()
    @IsString()
    EMAIL: string;

    @IsNotEmpty()
    @IsString()
    USERNAME: string;
}
