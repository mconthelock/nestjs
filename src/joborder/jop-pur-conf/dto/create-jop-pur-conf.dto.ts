import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';

export class CreateJopPurConfDto {
    @IsNotEmpty()
    @IsString()
    MFGNO: string;
    
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    PONO: number;
    
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    LINENO: number;
    
    @IsNotEmpty()
    @IsString()
    CONFIRMDATE: string;
    
    @IsOptional()
    @IsString()
    REMARK: string;
    
    @IsNotEmpty()
    @IsString()
    ACTION_BY: string;
}
