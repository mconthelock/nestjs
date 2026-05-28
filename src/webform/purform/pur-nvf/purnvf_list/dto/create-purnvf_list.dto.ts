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
    @IsOptional()
    PURPOSE?: string;

    @IsString()
    @IsOptional()
    TYPEJOB?: string;

    @IsString()
    @IsOptional()
    SERVICE?: string;   

    @IsString()
    @IsOptional()
    REASON?: string;   

    @IsString()
    @IsOptional()
    VENDCODE?: string;

    @IsString()
    @IsOptional()
    VENDTYPE?: string;

    @IsString()
    COMNAME: string;

    @IsString()
    @IsOptional()
    CONTACT?: string;

    @IsString()
    @IsOptional()
    EMAIL?: string;
    
    @IsString()
    @IsOptional()
    WEBSITE?: string;

    @IsString()
    @IsOptional()
    TELNO?: string;

    @IsString()
    @IsOptional()
    FAX?: string;

    @IsString()
    @IsOptional()
    BANKNAME?: string;

    @IsString()
    @IsOptional()
    BRANCH?: string;

    @IsString()
    @IsOptional()
    ACCNUMBER?: string;

    @IsString()
    @IsOptional()
    TERMCODE?: string;
}
