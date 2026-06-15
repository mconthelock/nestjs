import { Entity, PrimaryColumn , Column, OneToOne } from 'typeorm';
import { VORGMST } from '../views/VORGMST.entity';
import { PPOSITION } from '../../amec/table/PPOSITION.entity';


@Entity({ name: 'FXA_LOCMST', schema: 'WEBFORM' })
export class FXA_LOCMST {
    @PrimaryColumn()
    LOCCODE: string;

    @Column()
    LOCNAME: string;

    @Column()
    VORGNO: string;

    @Column()
    SPOSCODE:string;

    @OneToOne(() => VORGMST, (o) => o.VORGNO)
    ORG: VORGMST;

    @OneToOne(() => PPOSITION, (p) => p.SPOSCODE)
    POS: PPOSITION;

}
