import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Formts } from './../../form/entities/formts.entity';

@Entity('FORMMSTTS')
export class Formmstts {
  @PrimaryColumn()
  NNO: string;

  @PrimaryColumn()
  VORGNO: string;

  @PrimaryColumn()
  CYEAR: string;

  @Column()
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

  @OneToOne(() => Formts, (form) => form.formmst)
  @JoinColumn([
    { name: 'NNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
  ])
  form: Formts;
}
