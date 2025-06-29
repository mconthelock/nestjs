import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Form } from 'src/webform/form/entities/form.entity';

@Entity('OTFORM')
export class GpOt {
  @PrimaryColumn()
  NFRMNO: string;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  CYEAR2: string;

  @PrimaryColumn()
  NRUNNO: string;

  @Column()
  EMPNO: string;

  @Column()
  WORKDATE: string;

  @Column()
  TIMEIN: string;

  @Column()
  TIMEOUT: string;

  @Column()
  OTJOB: string;

  @Column()
  WKTYPENO: string;

  @Column()
  REMARK: string;

  @Column()
  FORSECCODE: string;

  @Column()
  VFILENAME: string;

  @Column()
  OT3: string;

  @Column()
  SPECIAL: string;

  @Column()
  SPECIAL_REASON: string;

  @OneToOne(() => Form, (form) => form.isdev)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  form: Form;
}
