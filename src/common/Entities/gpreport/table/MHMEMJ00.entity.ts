//Employee Physical File for Japan
import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'MHMEMJ00', schema: 'AMECMFG' })
export class MHMEMJ00 {
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
    EMPEDT: number;

    @Column()
    EMPPDT: number;

    @Column()
    EMPRDT: number;

    @Column()
    EMPSHF: string;

    @Column()
    EMPCOS: string;

    @Column()
    EMPBNC: string;

    @Column()
    EMPACN: string;

    @Column()
    EMPDEW: number;

    @Column()
    EMPREQ: string;

    @Column()
    EMPAWO: number;

    @Column()
    EMPLST: number;

    @Column()
    EMPUSR: string;

    @Column()
    PSNIDN: string;

    @Column()
    FAMSCO: string;

    @Column()
    EMPTAX: string;
}
