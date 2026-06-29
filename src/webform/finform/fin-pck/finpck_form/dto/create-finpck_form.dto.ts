import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from 'class-validator';
import { FormDto } from 'src/webform/form/dto/form.dto';

export class CreateFinpckFormDto extends PickType(FormDto,[
'NFRMNO',
'VORGNO',
'CYEAR',
'CYEAR2',
'NRUNNO',
] as const) {    
    @IsNotEmpty()
    @IsString()
    CCCODE: string;

    @IsNotEmpty()
    @IsString()
    CCDESC: string;

    @IsNotEmpty()
    @IsString()
    LOCCODE: string; 

    @IsNotEmpty()
    @IsString()
    LOCNAME: string; 

}
