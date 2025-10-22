import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('ISTID_FORM')
export class IsTid {
  @PrimaryColumn()
  NFRMNO: number;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: number;

  @Column()
  TID_REQUESTER: string;

  @Column()
  TID_REQNO: string;

  @Column()
  TID_REQ_DATE: Date;

  @Column()
  TID_TIMESTART: string;

  @Column()
  TID_TIMEEND: string;

  @Column()
  TID_SERVERNAME: string;

  @Column()
  TID_USERLOGIN: string;

  @Column()
  TID_CONTROLLER: string;

  @Column()
  TID_WORKCONTENT: string;

  @Column()
  TID_REASON: string;

  @Column()
  TID_COMP_DATE: Date;

  @Column()
  TID_COMP_TIME: string;

  @Column()
  TID_DISABLE_DATE: Date;

  @Column()
  TID_DISABLE_TIME: string;

  @Column()
  TID_CHANGEDATA: number;

  @Column()
  TID_FORMTYPE: number;

  @Column()
  TID_CREATEDATE: Date;

  @Column()
  TID_LATE: number;
}
