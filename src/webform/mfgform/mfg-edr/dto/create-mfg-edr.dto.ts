export class CreateMfgEdrDto {
  NFRMNO: number;
  VORGNO: string;
  CYEAR: string;
  CYEAR2: string;
  NRUNNO: number;

  TID?: number | null;
  SSECCODE?: string | null;
  CID?: number | null;
  REPAIR_BY?: string | null;
  DAILY_MONTH?: string | null;
  DAILY_RUNNO?: number | null;
  REASON_CAUSE?: string | null;

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

  att?: {
    FILENAME?: string | null;
  }[];
}