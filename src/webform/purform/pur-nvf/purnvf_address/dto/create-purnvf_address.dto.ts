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

export class CreatePurnvfAddressDto extends PickType(FormDto, [
    'NFRMNO',
    'VORGNO',
    'CYEAR',
    'CYEAR2',
    'NRUNNO',
] as const) {
    @IsNotEmpty()
    @IsString()
    ADDRTYPE: string;

    @IsNotEmpty()
    @IsString()
    ADDR1: string;

    @IsNotEmpty()
    @IsString()
    ADDR2: string;

    @IsString()
    CITY: string;

    @IsString()
    STATE: string;

    @IsString()
    COUNTRY: string;

    @IsString()
    POSTCODE: string;
}
