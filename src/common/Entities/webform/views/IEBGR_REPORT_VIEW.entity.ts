import { View, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'IEBGR_REPORT_VIEW', schema: 'WEBFORM' })
export class IEBGR_REPORT_VIEW {
  @ViewColumn()
  FORMNO: string;

  @ViewColumn()
  NFRMNO: number;

  @ViewColumn()
  VORGNO: string;

  @ViewColumn()
  CYEAR: string;

  @ViewColumn()
  CYEAR2: string;

  @ViewColumn()
  NRUNNO: number;

  @ViewColumn()
  ISSUE_DATE: Date;

  @ViewColumn()
  EMPNO: string;

  @ViewColumn()
  RESPONSIBLE_PERSON: string;

  @ViewColumn()
  DEPT: string;

  @ViewColumn()
  BUDGET_YEAR: string;

  @ViewColumn()
  INVESTMENT_SN: string;

  @ViewColumn()
  RECIVED_BUDGET: number;

  @ViewColumn()
  REQUEST_AMOUT: number;

  @ViewColumn()
  FINDATE: Date;

  @ViewColumn()
  ITMNAME: string;

  @ViewColumn()
  PPRESDATE: Date;

  @ViewColumn()
  GPBID: string;

  @ViewColumn()
  FORM_STATUS: string;

  @ViewColumn()
  REQUESTER: Date;

  @ViewColumn()
  REQ_SEM_APPDATE: Date;

  @ViewColumn()
  REQ_DDEM_APPDATE: Date;

  @ViewColumn()
  REQ_DEM_APPDATE: Date;

  @ViewColumn()
  REQ_DDIM_APPDATE: Date;

  @ViewColumn()
  REQ_DIM_APPDATE: Date;

  @ViewColumn()
  IE_DEM_APPDATE: Date;

  @ViewColumn()
  EP_DDIM_APPDATE: Date;
  
  @ViewColumn()
  EP_DDIM_APPDATE2: Date;
  
  @ViewColumn()
  EP_DIM_APPDATE: Date;

  @ViewColumn()
  GMFAC_APPDATE: Date;

  @ViewColumn()
  CAT_DEM_APPDATE: Date;

  @ViewColumn()
  RAF_DIM_APPDATE: Date;

  @ViewColumn()
  P_APPDATE: Date;

  @ViewColumn()
  ADMIN_APPDATE: Date;

  prpo: any;
}
