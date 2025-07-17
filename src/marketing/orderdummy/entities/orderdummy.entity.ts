import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('TMARKET_TEMP_DUMMY')
export class Orderdummy {
  @Column()
  RECON_PARTS: string;

  @Column()
  SERIES: string;

  @Column()
  AGENT: string;

  @Column()
  PRJ_NO: string;

  @Column()
  PRJ_NAME: string;

  @Column()
  DSTN: string;

  @Column()
  ORDER_NO: string;

  @Column()
  SPEC: string;

  @Column()
  OPERATION: string;

  @PrimaryColumn()
  MFGNO: string;

  @Column()
  CAR_NO: string;

  @Column()
  IDS_DATE: string;

  @PrimaryColumn()
  EDIT_DATE: Date;

  @PrimaryColumn()
  REVISION_CODE: string;

  @PrimaryColumn()
  REVISION_EDIT: string;
}
