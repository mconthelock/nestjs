import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMfgEdrDto {
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

  @IsString()
  REQBY?: string;

  @IsOptional()
  @IsNumber()
  TID?: number | null;

  @IsOptional()
  @IsString()
  SSECCODE?: string | null;

  @IsOptional()
  @IsNumber()
  CID?: number | null;

  @IsOptional()
  @IsString()
  REPAIR_BY?: string | null;

  @IsOptional()
  @IsString()
  DAILY_MONTH?: string | null;

  @IsOptional()
  @IsNumber()
  DAILY_RUNNO?: number | null;

  @IsOptional()
  @IsString()
  REASON_CAUSE?: string | null;

  @IsOptional()
  @IsArray()
  list?: {
    ORDERNO?: string | null;
    DWGNO?: string | null;
    ITEM?: string | null;
    QTY?: number | null;
    DETAIL?: string | null;
    LV_EFFECT?: string | null;
    EFFECT?: string | null;
    LID?: number | null;
    PID?: number | null;
    LOT?: string | null;
    SERIAL?: string | null;
    PRDN_JUN?: string | null;
  }[];

  @IsOptional()
  @IsArray()
  att?: {
    FILENAME?: string | null;
  }[];
}