import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISDEV_BENEFIT', schema: 'WEBFORM' })
export class ISDEV_BENEFIT {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: number;

    @PrimaryColumn()
    NRUNNO: number;

    @PrimaryColumn()
    BENEFIT: number;

    @Column()
    BENEFIT_CURRENT: number;

    @Column()
    BENEFIT_AFTER: number;
}
