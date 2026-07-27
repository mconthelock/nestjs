export class CreatePilineBendingMainDto {
  IDTAG: string;
  TYPE?: string;
  SHEET_COLOR?: string;
  ITEM?: string;

  AT?: number;
  BT?: number;
  AM?: number;
  BM?: number;
  AL?: number;
  BL?: number;

  TA1?: number;
  TA2?: number;
  TA3?: number;
  TA4?: number;

  TB1?: number;
  TB2?: number;
  TB3?: number;
  TB4?: number;

  RECORD_DATE?: Date;
  RECORD_BY?: string;
}