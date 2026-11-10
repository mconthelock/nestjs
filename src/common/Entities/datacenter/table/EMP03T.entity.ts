import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'EMP03T', schema: 'AMECMFG' })
export class EMP03T {
    @PrimaryColumn()
    EMPCOD: string;

    @Column()
    MARSTT: string;

    @Column()
    MARSTE: string;

    @Column()
    FAMMRN: string;

    @Column()
    FAMMRD: number;

    @Column()
    FAMSNA: string;

    @Column()
    FAMSTX: string;

    @Column()
    FAMCHI: number;

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
    TAXINS: number;

    @Column()
    TAXSIN: number;

    @Column()
    TAXRMF: number;

    @Column()
    TAXLTF: number;

    @Column()
    TAXINL: number;

    @Column()
    TAXEDU: number;

    @Column()
    TAXDON: number;

    @Column()
    TAXINH: number;

    @Column()
    TAXINP: number;

    @Column()
    TAXANU: number;

    @Column()
    TAXDIS: number;

    @Column()
    TAXPRG: number;

    @Column()
    TAXOT1: number;

    @Column()
    TAXOT2: number;
}
