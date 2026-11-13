import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { GPLY01_TAXAS400 } from './GPLY01_TAXAS400.entity';
import { FORM } from './FORM.entity';

@Entity({ name: 'GPLY01_TAX', schema: 'WEBFORM' })
export class GPLY01_TAX {
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

    @Column()
    EMPCOD: string;

    @Column()
    MARSTT: string;

    @Column()
    MARSTE: string;

    @Column()
    FAMMRN: string;

    @Column()
    FAMMRD: Date;

    @Column()
    FAMSNA: string;

    @Column()
    FAMSTX: string;

    @Column()
    C1NED: number;

    @Column()
    C1IED: number;

    @Column()
    C2NED: number;

    @Column()
    C2IED: number;

    @Column()
    TAXEMF: string;

    @Column()
    TAXEMM: string;

    @Column()
    TAXSFT: string;

    @Column()
    TAXSPM: string;

    @Column()
    TAXPRG: number;

    @Column()
    TAXDIS: number;

    @Column()
    TAXINS: number;

    @Column()
    TAXINH: number;

    @Column()
    TAXINP: number;

    @Column()
    TAXRMF: number;

    @Column()
    TAXANU: number;

    @Column()
    TAXINL: number;

    @Column()
    TAXLTF: number;

    @Column()
    TAXEDU: number;

    @Column()
    TAXDON: number;

    @Column()
    TAXOT1: number;

    @Column()
    TAXOT2: number;

    @OneToOne(() => FORM)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: FORM;
}
