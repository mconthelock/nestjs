import { Entity, PrimaryColumn, OneToOne } from 'typeorm';
import { AMECUSERALL } from '../../amec/views/AMECUSERALL.entity';

@Entity({ name: 'ORGPOS', schema: 'WEBFORM' })
export class ORGPOS {
    @PrimaryColumn()
    VPOSNO: string;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    VEMPNO: string;

    @OneToOne(() => AMECUSERALL, (u) => u.ORGPOS)
    EMPINFO: AMECUSERALL;
}
