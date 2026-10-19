import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISDEV_MANHOURS', schema: 'WEBFORM' })
export class ISDEV_MANHOURS {
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
    POSITION: string;

    @Column()
    COST: number;

    @Column()
    HOURS_PRESENT: number;

    @Column()
    HOURS_AFTER: number;
}
