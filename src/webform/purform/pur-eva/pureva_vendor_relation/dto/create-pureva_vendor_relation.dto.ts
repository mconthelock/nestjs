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

export class CreatePurevaVendorRelationDto extends PickType(FormDto,[
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
    ENTITY_TYPE?: string;

    @IsOptional()
    @IsString()
    ENTITY_NAME?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    PERCENT?: number;  



}


