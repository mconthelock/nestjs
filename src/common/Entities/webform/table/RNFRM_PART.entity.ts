import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RNFRM_PART', schema: 'WEBFORM' })
export class RNFRM_PART {
  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: number;

  @Column()
  STATUS: string;

  @Column()
  SENDDATE: Date;

  @Column()
  URGENT: string;
}