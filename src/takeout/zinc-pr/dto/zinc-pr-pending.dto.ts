export class ZincPrPendingRowDto {
  TDETAIL_TAKEOUTNO: string;
  ITEM_MASTER: string | null;
  TOTAL_WEIGHT_ADJUST: number | string | null;
  PROCESS: string;
  MAX_PROD: string | null;
  ITEM: string | null;
  DWGNO: string | null;
  DESCRIPTION: string | null;
}

export class T003KpDto {
  T03PR: number;
  T03LIN: number;
  T03CTL: string;
  T03SEQ: number;
  T03CUS: string | null;
  T03REQ: number;
  T03REC: number;
}

export class ZincPrPendingResultDto {
  T02PR: number;
  T02LIN: number;
  T02CTL: string;
  T02ITM: string | null;
  T02TYP: string;
  T02CLS: string;
  T02DWG: string | null;
  T02DES: string | null;
  T02VND: number;
  T02REQ: number;
  T02REC: number;
  T02DUE: string;
  T02JOB: string | null;
  T02ORD: string;
  T02PRN: string;
  T02DEL: string;
  T02SCH: string | null;
  T02RMK: string;
  T003KP: T003KpDto;
  TDETAIL_TAKEOUTNOS: string[];
}

export class ZincPrInvalidTakeoutDto {
  TDETAIL_TAKEOUTNO: string;
  PROCESSES: string[];
}