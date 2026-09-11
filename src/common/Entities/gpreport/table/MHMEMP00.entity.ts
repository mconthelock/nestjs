//Employee Physical File
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'MHMEMP00', schema: 'AMECMFG' })
export class MHMEMP00 {
    @PrimaryColumn()
    EMPCOD: string;

    @Column()
    EMPTYP: string;

    @Column()
    EMPPRT: string;

    @Column()
    EMPNMT: string;

    @Column()
    EMPPRE: string;

    @Column()
    EMPNME: string;

    @Column()
    EMPNMS: string;

    @Column()
    EMPSEX: string;

    @Column()
    EMPSTA: string;

    @Column()
    EMPDEP: string;

    @Column()
    EMPPOS: string;

    @Column()
    EMPEDT: string;

    @Column()
    EMPPDT: string;

    @Column()
    EMPRDT: string;

    @Column()
    EMPSHF: string;

    @Column()
    EMPCOS: string;

    @Column()
    EMPBNC: string;

    @Column()
    EMPACN: string;

    @Column()
    EMPDEW: string;

    @Column()
    EMPREQ: string;

    @Column()
    EMPAWO: string;

    @Column()
    EMPLST: string;

    @Column()
    EMPUSR: string;
}
