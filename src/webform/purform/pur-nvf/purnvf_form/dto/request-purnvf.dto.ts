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

    @IsOptional()
    @IsString()
    VENDORCODE?: string;

    @IsOptional()
    @IsString()
    TYPEJOB?: string;

    @IsOptional()
    @IsString()
    SERVICE?: string;

    @IsOptional()
    @IsString()
    PURPOSE?: string;

    @IsOptional()
    @IsString()
    REASON?: string; 

    @IsNotEmpty()
    @IsString()
    COMPANY_NAME: string; 

    @IsOptional()
    @IsString()
    VENDOR_LOCATION?: string;  

	@IsOptional()
    @IsString()
    ADDRESS_EN?: string;  

    @IsOptional()
    @IsString()
    PROVINCE_EN?: string;  

    @IsOptional()
    @IsString()
    DISTRICT_EN?: string;     

    @IsOptional()
    @IsString()
    SUB_DISTRICT_EN?: string;   

    @IsOptional()
    @IsString()
    POSTCODE_EN?: string; 

    @IsOptional()
    @IsString()
    COUNTRY_EN?: string; 

    @IsOptional()
    @IsString()
    ADDRESS_TH?: string;  

    @IsOptional()
    @IsString()
    PROVINCE_TH?: string;  

    @IsOptional()
    @IsString()
    DISTRICT_TH?: string;     

    @IsOptional()
    @IsString()
    SUB_DISTRICT_TH?: string;   

    @IsOptional()
    @IsString()
    POSTCODE_TH?: string; 

    @IsOptional()
    @IsString()
    COUNTRY_TH?: string; 

    @IsOptional()
    @IsString()
    CONTACT?: string; 

    @IsOptional()
    @IsString()
    EMAIL?: string;  

    @IsOptional()
    @IsString()
    WEBSITE?: string;  

    @IsOptional()
    @IsString()
    TELNO?: string; 

    @IsOptional()
    @IsString()
    FAX?: string;  

    @IsOptional()
    @IsString()
    BANKNAME?: string; 

    @IsOptional()
    @IsString()
    BRANCH?: string; 

    @IsOptional()
    @IsString()
    ACCNUMBER?: string;   

    @IsOptional()
    @IsString()
    TERMCODE?: string;   

}