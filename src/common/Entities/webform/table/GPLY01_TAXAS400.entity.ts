import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'GPLY01_TAXAS400', schema: 'AMECMFG' })
export class GPLY01_TAXAS400 {
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
}
