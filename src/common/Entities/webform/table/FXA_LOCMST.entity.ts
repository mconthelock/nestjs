import { Entity, PrimaryColumn , Column, ManyToOne ,JoinColumn } from 'typeorm';
import { VORGMST } from '../views/VORGMST.entity';
import { PPOSITION } from '../../amec/table/PPOSITION.entity';
import { ORGPOS } from './ORGPOS.entity';



@Entity({ name: 'FXA_LOCMST', schema: 'WEBFORM' })
export class FXA_LOCMST {
    @PrimaryColumn()
    LOCCODE: string;

    @Column()
    LOCNAME: string;

    @Column()
    SPOSCODE:string;

    @Column({ name: 'VORGNO' })
    VORGNO: string;

    @ManyToOne(() => VORGMST)
    @JoinColumn([
         { name: 'VORGNO', referencedColumnName: 'VORGNO' }
    ])
    ORG: VORGMST;

    @ManyToOne(() => PPOSITION)
    @JoinColumn([
         { name: 'SPOSCODE', referencedColumnName: 'SPOSCODE' }
    ])
    POS: PPOSITION;

    @ManyToOne(() => ORGPOS)
    @JoinColumn([
        { name: 'SPOSCODE', referencedColumnName: 'VPOSNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' }
    ])
    INC: ORGPOS;


}
