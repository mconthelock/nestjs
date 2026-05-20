import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISEVA_SESSIONS', schema: 'WEBFORM' })
export class ISEVA_SESSIONS {
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
    PROJECT_ID: number;

    @Column()
    EVAPRO_AVG: number;

    @Column()
    EVAAPP_AVG: number;

    @Column()
    OVERALL_AVG: number;

    @Column()
    OVERALL_LEVEL: string;

    @Column()
    COMMENTS: string;
}
