import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Form } from './../../form/entities/form.entity';

@Entity('FORMMST')
export class Formmst {
  @PrimaryColumn()
  NNO: string;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @PrimaryColumn()
  NRUNNO: string;

  @Column()
  VNAME: string;

  @Column()
  VANAME: string;

  @Column()
  VDESC: string;

  @Column()
  DCREDATE: string;

  @Column()
  CCRETIME: string;

  @Column()
  VAUTHPAGE: string;

  @Column()
  VFORMPAGE: string;

  @Column()
  VDIR: string;

  @Column()
  NLIFETIME: string;

  @Column()
  CSTATUS: string;

  @OneToOne(() => Form, (form) => form.formmst)
  @JoinColumn([
    { name: 'NNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
  ])
  form: Form;
}
