import { ESCSItemStation } from '../../item-station/entities/item-station.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  ViewColumn,
  ViewEntity,
} from 'typeorm';

@ViewEntity({
  name: 'USERS_AUTHORIZE_VIEW',
  schema: 'ESCCHKSHT'
})
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

  @OneToOne(() => ESCSItemStation, (s) => s.AUTHORIZE_VIEW)
  @JoinColumn({ name: 'IT_NO', referencedColumnName: 'ITS_ITEM' })
  @JoinColumn({ name: 'STATION_NO', referencedColumnName: 'ITS_NO' })
  STATION: ESCSItemStation;
}
