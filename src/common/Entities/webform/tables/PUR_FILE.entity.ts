import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { PURCPM_FORM } from './PURCPM_FORM.entity';

@Entity({ name: 'PUR_FILE', schema: 'WEBFORM' })
export class PUR_FILE {
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

  @PrimaryColumn()
  FILE_ID: number;

  @Column()
  FILE_ONAME: string;

  @Column()
  FILE_FNAME: string;

  @Column()
  FILE_USERCREATE: string;

  @Column()
  FILE_DATECREATE: Date;

  @Column()
  FILE_USERUPDATE: string;

  @Column()
  FILE_DATEUPDATE: Date;

  @Column()
  FILE_TYPE: number;

  @Column()
  FILE_STATUS: number;

  @Column()
  FILE_PATH: string;

  @ManyToOne(() => PURCPM_FORM, (s) => s.FILES)
  @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
  @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
  @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
  @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
  @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
  MASTER: PURCPM_FORM;
}
