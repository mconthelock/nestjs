import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'REP', schema: 'WEBFORM' })
export class REP {
    @PrimaryColumn()
    VEMPNO: string;

    @Column()
    VREPNO: string;

    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;
}
