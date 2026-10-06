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

export class CreatePurevaScoreDto extends PickType(FormDto,[
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
] as const) { 
    
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    EVAID: number;

    @IsOptional()
    @IsString()
    TOPIC?: string;

    @IsOptional()
    @IsString()
    TOPIC_DESC?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    SCORE?: number;  

    @IsOptional()
    @IsString()
    SLEVEL?: string;

}

