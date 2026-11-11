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
    SEMPNO: string;

    @Column()
    MARSTT: string;

    @Column()
    MARSTE: string;

    @Column()
    FAMMRD: string;

    @Column()
    FAMSNA: string;

    @Column()
    FAMIED: number;

    @Column()
    FAMNED: number;

    @Column()
    FAMCHI: number;

    @Column()
    TAXEMF: string;

    @Column()
    TAXEMM: string;

    @Column()
    TAXSFT: string;

    @Column()
    TAXSPM: string;

    @Column()
    TAXDIS: string;

    @Column()
    TAXPREG: number;

    @Column()
    TAXINS: number;

    @Column()
    TAXSIN: number;

    @Column()
    TAXINH: number;

    @Column()
    TAXLTF: number;

    @Column()
    TAXRMF: number;

    @Column()
    TAXPENS: number;

    @Column()
    TAXFUND: number;

    @Column()
    TAXEDU: number;

    @Column()
    TAXDON: number;

    @Column()
    TAXINL: number;

    @Column()
    TAXINP: number;

    @Column()
    TAXISM: number;

    @Column()
    TAXOT1: number;

    @Column()
    TAXOT2: number;

    @Column()
    FAMIED1: number;

    @Column()
    FAMNED1: number;

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
