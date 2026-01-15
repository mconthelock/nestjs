import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { doactionFlowDto } from 'src/webform/flow/dto/doaction-flow.dto';

export class BGRDelImageDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  colno: string;
}

export class BGRDelAttDto {
  @IsNotEmpty()
  @IsString()
  id: string; 

  @IsNotEmpty()
  @IsString()
  typeno: string;
}

export class BGRReturnDto extends PickType(doactionFlowDto, [
  'NFRMNO',
  'VORGNO',
  'CYEAR',
  'CYEAR2',
  'NRUNNO',
  'ACTION',
  'EMPNO',
] as const) {
  @IsOptional()
  @IsArray()
  @Type(() => BGRDelImageDto)
  delImage?: BGRDelImageDto[];

    @IsOptional()
  @IsArray()
  @Type(() => BGRDelAttDto)
  delattach?: BGRDelAttDto[];
}

export class CreateIeBgrDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isReturn?: boolean;

  @IsOptional()
  @Type(() => BGRReturnDto)
  returnData?: BGRReturnDto;

  @IsNotEmpty()
  @IsString()
  empInput: string;

  @IsNotEmpty()
  @IsString()
  empRequest?: string;

  @IsOptional()
  @IsString()
  remark?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  PREDATE?: Date;

  @IsNotEmpty()
  @IsString()
  BGTYPE: string;

  @IsNotEmpty()
  @IsString()
  FYEAR: string;

  @IsNotEmpty()
  @IsString()
  SN: string;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  RECBG: number;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  USEDBG: number;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  REMBG: number;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? Number(value.replace(/,/g, '')) : value,
  )
  //   @Type(() => Number)
  @IsNumber()
  REQAMT: number;

  @IsNotEmpty()
  @IsString()
  RESORG: string;

  @IsNotEmpty()
  @IsString()
  PIC: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  FINDATE: Date;

  @IsNotEmpty()
  @IsString()
  ITMNAME: string;

  @IsNotEmpty()
  @IsString()
  PURPOSE: string;

  @IsNotEmpty()
  @IsString()
  DETPLAN: string;

  @IsNotEmpty()
  @IsString()
  INVDET: string;

  @IsNotEmpty()
  @IsString()
  EFFT: string;

  @IsNotEmpty()
  @IsString()
  SCHEDULE: string;

  @IsOptional()
  @IsString()
  REMARK?: string;

  @IsNotEmpty()
  @IsString()
  GPBID: string;

  @IsNotEmpty()
  @IsString()
  GPYear: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BGRQuotationDto)
  quotation: BGRQuotationDto[];
}

export class BGRQuotationDto {
  @IsNotEmpty()
  @IsString()
  QTA_FORM: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  QTA_VALID_DATE?: Date;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TOTAL?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true }) // หากพี่ปิ๊กอยากให้ต้องเอา quotation ที่มี product เท่านั้น ให้เปิดบรรทัดนี้และไปเพิ่ม check ที่ fontend ให้กรองเฉพาะ quotation ที่มี product ด้วย
  @Type(() => BGRQuotationProductDto)
  product?: BGRQuotationProductDto[];
}

export class BGRQuotationProductDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  SEQ: number;

  @IsOptional()
  @IsString()
  SVENDCODE: string;

  @IsOptional()
  @IsString()
  SVENDNAME: string;

  @IsOptional()
  @IsString()
  PRODCODE: string;

  @IsOptional()
  @IsString()
  PRODNAME: string;

  @IsOptional()
  @IsString()
  UNITCODE: string;

  @IsOptional()
  @IsString()
  UNIT: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  QTY: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  PRICE: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  CURRENCY: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  TOTAL: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  CURRYEAR: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  CURRSECT: number;

  @IsOptional()
  @IsString()
  CURRCODE: string;
}

