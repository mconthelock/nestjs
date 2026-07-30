import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
  name: 'VIEW_MFG_EDR_REPORT',
  schema: 'WEBFORM',
  synchronize: false,
})
export class VIEW_MFG_EDR_REPORT {
  @ViewColumn()
  ISSUE_DATE: string;

  @ViewColumn()
  SSECCODE: string;

  @ViewColumn()
  SEC: string;

  @ViewColumn()
  DEPT: string;

  @ViewColumn()
  REQUEST_NO: string;

  @ViewColumn()
  DAILY_REPORT_NO: string;

  @ViewColumn()
  ORDERNO: string;

  @ViewColumn()
  PRDN_JUN: string;

  @ViewColumn()
  MODEL: string;

  @ViewColumn()
  DWGNO: string;

  @ViewColumn()
  ITEM: string;

  @ViewColumn()
  CAUSE: string;

  @ViewColumn()
  PROCESS: string;

  @ViewColumn()
  LINE: string;

  @ViewColumn()
  QTY: number;

  @ViewColumn()
  DETAIL: string;

  @ViewColumn()
  REPAIR_BY_NAME: string;

  @ViewColumn()
  TYPENAME: string;

  @ViewColumn()
  CST: string;

  @ViewColumn()
  APPROVE_DATE: string;

  @ViewColumn()
  CYEAR2: string;

  @ViewColumn()
  NRUNNO: number;

  @ViewColumn()
  REPAIR_BY: string;

  @ViewColumn()
  DAILY_MONTH: string;

  @ViewColumn()
  DAILY_RUNNO: number;

  @ViewColumn()
  VREQNO: string;

  @ViewColumn()
  TID: number;

  @ViewColumn()
  CID: number;

  @ViewColumn()
  LID: number;

  @ViewColumn()
  PID: number;
}