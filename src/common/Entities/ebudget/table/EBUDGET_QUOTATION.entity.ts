import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'EBUDGET_QUOTATION', schema: 'EBUDGET' })
export class EBUDGET_QUOTATION {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  NFRMNO: number;

  @Column()
  VORGNO: string;

  @Column()
  CYEAR: string;

  @Column()
  CYEAR2: string;

  @Column()
  NRUNNO: number;

  @Column()
  QTA_FORM: string;

  @Column()
  QTA_VALID_DATE: Date;

  @Column()
  TOTAL: number;

  @Column()
  DATE_CREATE: Date;

  @Column()
  DATE_UPDATE: Date;

  @Column()
  CREATE_BY: string;

  @Column()
  UPDATE_BY: string;

  @Column()
  STATUS: number;
}
