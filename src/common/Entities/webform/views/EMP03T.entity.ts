import { ViewEntity, PrimaryColumn, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'EMP03T', schema: 'WEBFORM' })
export class EMP03T {
    @PrimaryColumn()
    EMPCOD: string;

    @ViewColumn()
    MARSTT: string;

    @ViewColumn()
    MARSTE: string;

    @ViewColumn()
    FAMMRN: string;

    @ViewColumn()
    FAMMRD: number;

    @ViewColumn()
    FAMSNA: string;

    @ViewColumn()
    FAMSTX: string;

    @ViewColumn()
    FAMCHI: number;

    @ViewColumn()
    C1NED: number;

    @ViewColumn()
    C1IED: number;

    @ViewColumn()
    C2NED: number;

    @ViewColumn()
    C2IED: number;

    @ViewColumn()
    TAXEMF: string;

    @ViewColumn()
    TAXEMM: string;

    @ViewColumn()
    TAXSFT: string;

    @ViewColumn()
    TAXSPM: string;

    @ViewColumn()
    TAXINS: number;

    @ViewColumn()
    TAXSIN: number;

    @ViewColumn()
    TAXRMF: number;

    @ViewColumn()
    TAXLTF: number;

    @ViewColumn()
    TAXINL: number;

    @ViewColumn()
    TAXEDU: number;

    @ViewColumn()
    TAXDON: number;

    @ViewColumn()
    TAXINH: number;

    @ViewColumn()
    TAXINP: number;

    @ViewColumn()
    TAXANU: number;

    @ViewColumn()
    TAXDIS: number;

    @ViewColumn()
    TAXPRG: number;

    @ViewColumn()
    TAXOT1: number;

    @ViewColumn()
    TAXOT2: number;
}
