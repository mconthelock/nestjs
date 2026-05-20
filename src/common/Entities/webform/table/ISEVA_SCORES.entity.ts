import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISEVA_SCORES', schema: 'WEBFORM' })
export class ISEVA_SCORES {
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

    @PrimaryColumn()
    EVA_ID: number;

    @Column()
    SCORE: string;
}
