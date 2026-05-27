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
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { CreatePurnvfListDto } from "../../purnvf_list/dto/create-purnvf_list.dto";
import { CreatePurnvfAddressDto } from "../../purnvf_address/dto/create-purnvf_address.dto";


export class CreatePurnvfFormDto extends PickType(CreateFormDto,[
'NFRMNO',
'VORGNO',
'CYEAR',
'REQBY',
'INPUTBY',
'REMARK',
] as const) {    
    @IsNotEmpty()
    @IsString()
    REQTYPE: string;

    @IsString()
    ATTTYPE: string;

    @IsOptional()
    @IsString()
    ATTOTH?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurnvfListDto)
    LISTS: CreatePurnvfListDto[];   

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreatePurnvfAddressDto)
    ADDRESSES: CreatePurnvfAddressDto[];    
}