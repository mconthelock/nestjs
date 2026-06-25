import {  Column, Entity, JoinColumn, OneToOne, PrimaryColumn} from 'typeorm';
import { Form1Wage } from 'src/webform/isform/form1-wage/entities/form1-wage.entity';


@Entity({ name: 'PPOSITION', schema: 'AMEC' })
export class PPOSITION {
    @PrimaryColumn()
    SPOSCODE: string;

    @Column()
    SPOSITION: string;

    @Column()
    SPOSNAME: string;

    @Column()
    SSTARTLEVEL: string;

    @OneToOne(() => Form1Wage, (pos) => pos.pposition)
  @JoinColumn({ name: 'SPOSCODE', referencedColumnName: 'POSITION' })
  wage: Form1Wage;

}
