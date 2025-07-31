import { Type } from 'class-transformer';
import { IsString, IsOptional, IsDate, IsNumber } from 'class-validator';

export class createDto {
  @IsNumber()
  @Type(() => Number)
  INQG_GROUP: number;

  @IsNumber()
  @Type(() => Number)
  INQD_SEQ: number;

  @IsNumber()
  @Type(() => Number)
  INQD_RUNNO: number;

  @IsString()
  @IsOptional()
  INQD_MFGORDER: string;

  @IsString()
  @IsOptional()
  INQD_ITEM: string;

  @IsString()
  @IsOptional()
  INQD_CAR: string;

  @IsString()
  @IsOptional()
  INQD_PARTNAME: string;

  @IsString()
  @IsOptional()
  INQD_DRAWING: string;

  @IsString()
  @IsOptional()
  INQD_VARIABLE: string;

  @IsNumber()
  @Type(() => Number)
  INQD_QTY: number;

  @IsString()
  @IsOptional()
  INQD_UM: string;

  @IsString()
  @IsOptional()
  INQD_SUPPLIER: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_SENDPART: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_UNREPLY: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_FC_COST: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_TC_COST: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_UNIT_PRICE: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_FC_BASE: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_TC_BASE: number;

  @IsString()
  @IsOptional()
  INQD_MAR_REMARK: string;

  @IsString()
  @IsOptional()
  INQD_DES_REMARK: string;

  @IsString()
  @IsOptional()
  INQD_FIN_REMARK: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_LATEST: number;

  @IsString()
  @IsOptional()
  INQD_OWNER: string;

  @IsString()
  @IsOptional()
  CREATE_AT: string;

  @IsString()
  @IsOptional()
  CREATE_BY: string;

  @IsString()
  @IsOptional()
  UPDATE_AT: string;

  @IsString()
  @IsOptional()
  UPDATE_BY: string;

  @IsString()
  @IsOptional()
  INQD_COMPARE: string;

  @IsString()
  @IsOptional()
  INQD_COMPARE_DATE: string;

  @IsString()
  @IsOptional()
  INQD_OWNER_GROUP: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ITEMID: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQID: number;

  @IsString()
  @IsOptional()
  TEST_FLAG: string;

  @IsString()
  @IsOptional()
  TEST_MESSAGE: string;

  @IsString()
  @IsOptional()
  AUTO_ADD: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_PREV: number;

  @IsString()
  @IsOptional()
  UPDATE_CODE: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  INQD_EXRATE: number;
}
