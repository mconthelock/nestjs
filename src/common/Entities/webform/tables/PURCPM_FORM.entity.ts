import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURCPM_FORM', schema: 'WEBFORM' })
export class PURCPM_FORM {
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
  DELIVELY: string;

  @Column()
  INVOICE_TYPE: string;

  @Column()
  INVOICE_OTHER: string;

  @Column()
  SUBJECT: string;

  @Column()
  ACCEPT_PO: string;

  @Column()
  ACCEPT_SUBCON: string;

  @Column()
  ACCEPT_OTHER: string;

  @Column()
  QUOTATION: string;

  @Column()
  QUOTATION_DATE: Date;

  @Column()
  PONO: string;

  @Column()
  TOTAL_AMOUNT: number;

  @Column()
  PO_SIGNBY: string;

  @Column()
  PO_SIGNDATE: Date;

  @Column()
  FORM_TYPE: string;

  @Column()
  INVOICE_NO: string;

  @Column()
  INVOICE_AMOUNT: number;

  @Column()
  PERSON_INCHARGE: string;

  @Column()
  INVOICE_DATE: Date;

  @Column()
  PAYMENT_TYPE: string;

  @Column()
  PAYMENT_NUM: number;

  @Column()
  PAYMENT: number;
}
