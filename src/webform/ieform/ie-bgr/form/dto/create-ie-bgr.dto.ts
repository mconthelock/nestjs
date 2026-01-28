import { PartialType, PickType } from '@nestjs/swagger';
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
  @Type(() => String)
  id: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  colno: string;
}

export class BGRDelAttDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  id: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
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
  @Type(() => String)
  empInput: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  empRequest?: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
  remark?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  PREDATE?: Date;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  BGTYPE: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  FYEAR: string;

  @IsNotEmpty()
  @IsString()
  @Type(() => String)
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
  @Type(() => String)
  PIC: string;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  FINDATE: Date;

  @IsOptional()
  @IsString()
  ITMNAME?: string;

  @IsOptional()
  @IsString()
  PURPOSE?: string;

  @IsNotEmpty()
  @IsString()
  DETPLAN: string;

  @IsNotEmpty()
  @IsString()
  INVDET: string;

  @IsOptional()
  @IsString()
  EFFT?: string;

  @IsNotEmpty()
  @IsString()
  SCHEDULE: string;

  @IsOptional()
  @IsString()
  REMARK?: string;

  @IsNotEmpty()
  @IsString()
  GPBID: string;

  //   @IsNotEmpty()
  //   @IsString()
  //   GPYear: string;

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
  @Type(() => String)
  SVENDCODE: string;

  @IsOptional()
  @IsString()
  SVENDNAME: string;

  @IsOptional()
  @IsString()
  @Type(() => String)
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

export class DraftIeBgrDto extends PartialType(CreateIeBgrDto) {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isDraft?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isSave?: boolean;

  @IsOptional()
  @IsString()
  @Type(() => String)
  DRAFT?: string;
}
