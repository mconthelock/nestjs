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
import { FormDto }  from "src/webform/form/dto/form.dto";

export class CreatePurnvfListDto extends PickType(FormDto,[
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) {    
    @IsString()
    PURPOSE: string;

    @IsString()
    TYPEJOB: string;

    @IsString()
    SERVICE: string;   

    @IsString()
    @IsOptional()
    REASON: string;   

    @IsString()
     @IsOptional()
    VENDCODE: string;

    @IsString()
    VENDTYPE: string;

    @IsString()
    COMNAME: string;

    @IsString()
    CONTACT: string;

    @IsString()
    EMAIL: string;
    
    @IsString()
    WEBSITE: string;

    @IsString()
    TELNO: string;

    @IsString()
    @IsOptional()
    FAX: string;

    @IsString()
    BANKNAME: string;

    @IsString()
    BRANCH: string;

    @IsString()
    ACCNUMBER: string;

    @IsString()
    TERMCODE: string;
}
