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

export class CreateFinpckAssetDto extends PickType(FormDto,[
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
    
    @IsNotEmpty()
    @IsString()
    GRPCODE: string;

    @IsNotEmpty()
    @IsString()
    ASSETNO: string;

    @IsNotEmpty()
    @IsString()
    ASSETDESC: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    DOCDATE?: Date; 

    @IsString()
    @IsOptional()
    VENDCODE?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    INITVAL?: number;
    
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    STARTDP?: Date; 

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    MONTHDP?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    YTDDP?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    ACCUMDP?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    BOOKVAL?: number;

    @IsOptional()
    @IsString()
    INVNO?: string;

    @IsOptional()
    @IsString()
    MODELNO?: string;

    @IsOptional()
    @IsString()
    SNNO?: string;  

    @IsOptional()
    @IsString()
    PONO?: string;    

    @IsOptional()
    @IsString()
    REFASSET?: string;   

    @IsOptional()
    @IsString()
    VOUCHER?: string;   

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    QTY?: number;

    @IsOptional()
    @IsString()
    UNIT?: string;     

    @IsOptional()
    @IsString()
    STATUS?: string;   

    @IsOptional()
    @IsString()
    SUPPLIER?: string;   
    
    @IsOptional()
    @IsString()
    PRNO?: string;   

    @IsOptional()
    @IsString()
    BUDGETNO?: string;    

    @IsOptional()
    @IsString()
    REQBY?: string;  

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    USINGLIFE?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    CONFIRM?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    NOSTICKER?: number; 

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    LOST?: number;  

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    DAMAGE?: number; 

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    MOVEMNET?: number; 

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    OTHCAUSE?: number; 

    @IsOptional()
    @IsString()
    REMOTHCAUSE?: string;   

    @IsOptional()
    @IsString()
    PIC?: string; 
}
