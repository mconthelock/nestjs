import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsDate,
    IsNotEmpty,
    IsNotEmptyObject,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
    ArrayMinSize,
    Validate
} from 'class-validator';
import { CreateFormDto } from 'src/webform/form/dto/create-form.dto';
import { CreatePurnvfFormDto } from "./create-purnvf_form.dto";
import { CreatePurnvfListDto } from "../../purnvf_list/dto/create-purnvf_list.dto";
import { CreatePurnvfAddressDto } from "../../purnvf_address/dto/create-purnvf_address.dto";


export class RequestPurnvfFormDto extends PickType(CreateFormDto,[
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
    @Transform(
        ({ value }) => (Array.isArray(value) ? value.join('|') : value), // ถ้าเป็น string เดี่ยว → wrap array
    )
    @IsOptional()
    ATTACH_TYPE?: string;

    @IsOptional()
    @IsString()
    ATTACH_OTHER?: string;

 
}