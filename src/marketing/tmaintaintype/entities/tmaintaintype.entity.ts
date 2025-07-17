import {
  Entity,
  PrimaryColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('TMAINTAINTYPE')
export class Tmaintaintype {
  @PrimaryColumn()
  ID: string;

  @Column()
  ABBREVIATION: string;

  @Column()
  DETAIL: string;

  @Column()
  EDI_PART_NUMBER: string;

  @Column()
  PC_FORM: string;

  @Column()
  SERIESNAME: string;

  @Column()
  DESCRIPTION_INVOICE: string;

  @Column()
  PREASSY: string;

  @Column()
  CAPAMIN: string;

  @Column()
  CAPAMAX: string;

  @Column()
  SPEDVALUE: string;

  @Column()
  REFERXML: string;

  @Column()
  STATUSACTIVE: string;

  @Column()
  TYPEOFMODEL: string;

  @Column()
  GROUPMAIL: string;

  @Column()
  BYPASSMODEL: string;

  @Column()
  MODERNIZE: string;
}
