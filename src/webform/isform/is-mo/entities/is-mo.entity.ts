import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Form } from 'src/webform/form/entities/form.entity';

@Entity('OPRFORM')
export class IsMo {
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
  VTITLE: string;

  @Column()
  NISOPRNO: string;

  @Column()
  VEQPREQ: string;

  @Column()
  DUSEREXP: string;

  @Column()
  VDETAIL: string;

  @Column()
  DADATE: string;

  @Column()
  DAEDATE: string;

  @Column()
  DPDATE: string;

  @Column()
  DPEDATE: string;

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
