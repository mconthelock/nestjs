import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISDEV_INVESTMENT', schema: 'WEBFORM', database: 'webform' })
export class ISDEV_INVESTMENT {
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
    DEVICE: number;

    @Column()
    QTY: number;

    @Column()
    PRICE: number;
}
