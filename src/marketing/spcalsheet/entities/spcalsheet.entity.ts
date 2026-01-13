import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
// import { InquiryDetail } from 'src/spprogram/inquiry-detail/entities/inquiry-detail.entity';

@Entity('SPCALSHEET_DETAIL')
export class Spcalsheet {
  @PrimaryColumn()
  INQNO: string;

  @PrimaryColumn()
  LINENO: number;

  @Column()
  INQTY: string;

  @Column()
  PRJNO: string;

  @Column()
  PONO: string;

  @PrimaryColumn()
  ORDNO: string;

  @PrimaryColumn()
  ELVNO: string;

  @Column()
  PRJORI: string;

  @Column()
  CARORI: string;

  @Column()
  AGENT: string;

  @Column()
  DSTN: string;

  @Column()
  CURR: string;

  @Column()
  CSSEQ: number;

  @Column()
  CSCAR: string;

  @Column()
  CSMFG: string;

  @Column()
  CSITEM: string;

  @Column()
  CSPNA: string;

  @Column()
  CSDWG: string;

  @Column()
  CSLT: number;

  @Column()
  CSSPPY: string;

  @Column()
  CSQTY: number;

  @Column()
  CSUAMT: number;

  @Column()
  CSTAMT: number;

  @Column()
  TRADER: string;

  @Column()
  SPEC: string;

  @Column()
  OPERATION: string;

  @Column()
  JJKK: number;

  @Column()
  HHTT: number;

  @Column()
  PT: number;

  @Column()
  REQ: string;

  @Column()
  CUSTREQ: Date;

  @Column()
  AMECREQSHIP: Date;

  @Column()
  MARREQPRDN: Date;

  @Column()
  PRDNORI: Date;

  @Column()
  INPUTBY: string;

  @Column()
  INPUTDT: Date;

  @Column()
  REVISEBY: string;

  @Column()
  REVISEDT: Date;

  @Column()
  CS2ND: string;

  //   @ManyToOne(() => InquiryDetail, (inqs) => inqs.spcalsheets)
  //   @JoinColumn([
  //     { name: 'INQNO', referencedColumnName: 'INQ_NO' },
  //     { name: 'LINENO', referencedColumnName: 'INQD_SEQ' },
  //   ])
  //   refdetail: InquiryDetail;
}
