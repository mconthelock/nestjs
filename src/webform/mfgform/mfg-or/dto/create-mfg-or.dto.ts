import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMfgOrDto {
  @IsNumber()
  NFRMNO: number;

  @IsString()
  VORGNO: string;

  @IsString()
  CYEAR: string;

  @IsString()
  CYEAR2: string;

  @IsNumber()
  NRUNNO: number;

  @IsOptional()
  @IsString()
  INPUTBY?: string;

  @IsString()
  REQBY?: string;

  @IsOptional()
  @IsString()
  SSECCODE?: string | null;

  @IsOptional()
  @IsString()
  SDEPCODE?: string | null;

  @IsOptional()
  @IsString()
  SSEC?: string | null;

  @IsOptional()
  @IsString()
  TYPEFORM?: string | null;

  @IsOptional()
  @IsString()
  CLASS?: string | null;

  @IsOptional()
  @IsString()
  TOPIC?: string | null;

  @IsOptional()
  @IsString()
  DWGNO?: string | null;

  @IsOptional()
  @IsString()
  SHOPNO?: string | null;

  @IsOptional()
  @IsString()
  ITEMNO?: string | null;

  @IsOptional()
  @IsString()
  APPLY_FOR?: string | null;

  @IsOptional()
  @IsNumber()
  SEQNO?: number | null;

  @IsOptional()
  @IsString()
  ORNO?: string | null;

  @IsOptional()
  @IsString()
  REV?: string | null;

  @IsOptional()
  @IsString()
  REMARK?: string | null;

  @IsOptional()
  @IsArray()
  att?: {
    FILENAME?: string | null;
  }[];
}