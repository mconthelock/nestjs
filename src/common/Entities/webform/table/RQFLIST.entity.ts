import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { RQFFRM } from './RQFFRM.entity';

@Entity({ name: 'RQFLIST', schema: 'WEBFORM' })
export class RQFLIST {
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
  ITEMNO: number;

  @Column()
  PRODCODE: string;

  @Column()
  PRODDESC: string;

  @Column()
  DRAWNO: string;

  @Column()
  SPEC: string;

  @Column()
  BRAND: string;

  @Column()
  QTY: number;

  @Column()
  UM: string;

  @Column()
  COUNTRY: string;

  @Column()
  MODEL: string;

  @Column()
  MAKERN: string;

  @Column()
  NOTE: string;

  @Column()
  HAZARD: string;

  @Column()
  BUYNOTE: string;

  @Column()
  CAPPROVE: string;

  @Column()
  PRICE: number;

  @Column()
  CURRENCY: string;

  @Column()
  HAZARDNO: string;

  @Column()
  SVENDCODE: string;

  @Column()
  LINE_STATUS: string;

  @Column()
  SEXPTYPE: string;

  @Column()
  SCATTYPE: string;

  @Column()
  SCATID: string;

  @Column()
  CST_LIST: string;

  @Column()
  REMARK_LIST: string;

  @ManyToOne(() => RQFFRM, (rqffrm) => rqffrm.RQFLIST)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  RQFFRM: RQFFRM;
}
