import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Form } from '../../form/entities/form.entity';

@Entity('FLOW')
export class Flow {
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
  CSTEPNO: string;

  @Column()
  CSTEPNEXTNO: string;

  @Column()
  CSTART: string;

  @Column()
  CSTEPST: string;

  @Column()
  CTYPE: string;

  @Column()
  VPOSNO: string;

  @Column()
  VAPVNO: string;

  @Column()
  VREPNO: string;

  @Column()
  VREALAPV: string;

  @Column()
  CAPVSTNO: string;

  @Column()
  DAPVDATE: Date;

  @Column()
  CAPVTIME: string;

  @Column()
  CEXTDATA: string;

  @Column()
  CAPVTYPE: string;

  @Column()
  CREJTYPE: string;

  @Column()
  CAPPLYALL: string;

  @Column()
  VURL: string;

  @Column()
  VREMARK: string;

  @Column()
  VREMOTE: string;

  @ManyToOne(() => Form, (form) => form.flow)
  @JoinColumn([
    { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
    { name: 'VORGNO', referencedColumnName: 'VORGNO' },
    { name: 'CYEAR', referencedColumnName: 'CYEAR' },
    { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
    { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
  ])
  form: Form;
}
