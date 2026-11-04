import { ManyToOne, PrimaryColumn, Entity, OneToOne, JoinColumn } from 'typeorm';
import { STY_CHEMICAL_REV } from './STY_CHEMICAL_REV.entity';
import { AMECUSERALL } from '../../amec/views/AMECUSERALL.entity';

@Entity({ name: 'STY_CHEMICAL_CONTROL', schema: 'GPREPORT' })
export class STY_CHEMICAL_CONTROL {
    @PrimaryColumn()
    OWNERCODE: string;

    @PrimaryColumn()
    CONTROLER: string;

    @ManyToOne(() => STY_CHEMICAL_REV, (rev) => rev.CONTROLS)
    @JoinColumn({ name: 'OWNERCODE', referencedColumnName: 'OWNERCODE' })
    REV: STY_CHEMICAL_REV;

    @OneToOne(() => AMECUSERALL)
    @JoinColumn({ name: 'CONTROLER', referencedColumnName: 'SEMPNO' })
    USER: AMECUSERALL;
}
