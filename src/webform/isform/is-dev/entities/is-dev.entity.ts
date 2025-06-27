import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Form } from 'src/webform/form/entities/form.entity';

@Entity('ISDEVFORM')
export class IsDev {
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
  CTYDEVNO: string;

  @Column()
  CTYSYSNO: string;

  @Column()
  VDETAIL: string;

  @Column()
  VCHGREQ: string;

  @Column()
  VSYSNAME: string;

  @Column()
  DUSEREXP: Date;

  @Column()
  DADATE: Date;

  @Column()
  DAEDATE: Date;

  @Column()
  DPDATE: Date;

  @Column()
  DPEDATE: Date;

  @Column()
  CTYMH: string;

  @Column()
  CITGC: string;

  @Column()
  NESTTIME: number;

  @Column()
  NACTTIME: number;

  @OneToOne(() => Form, (form) => form.devform)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  form: Form;
}
