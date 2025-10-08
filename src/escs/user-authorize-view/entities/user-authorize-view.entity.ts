import { Column, Entity, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity('ESCS_USERS_AUTHORIZE_VIEW')
export class ESCSUserAuthorizeView {
  @ViewColumn()
  USR_ID: number;

  @ViewColumn()
  USR_NO: string;

  @ViewColumn()
  USR_NAME: number;

  @ViewColumn()
  IT_NO: string;

  @ViewColumn()
  STATION_NO: number;

  @ViewColumn()
  SPOSITION: string;

  @ViewColumn()
  USR_STATUS: number;

  @ViewColumn()
  SCORE: number;

  @ViewColumn()
  GRADE: string;

  @ViewColumn()
  TOTAL: number;

  @ViewColumn()
  PERCENT: number;

  @ViewColumn()
  REV: number;

  @ViewColumn()
  TEST_BY: string;

  @ViewColumn()
  TEST_DATE: Date;

  @ViewColumn()
  TR: number;

  @ViewColumn()
  SSEC: string;

  @ViewColumn()
  SSECCODE: string;

  @ViewColumn()
  SDEPT: string;

  @ViewColumn()
  SDEPCODE: string;

  @ViewColumn()
  SDIV: string;

  @ViewColumn()
  SDIVCODE: string;
}
