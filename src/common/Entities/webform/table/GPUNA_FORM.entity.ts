import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'GPUNA_FORM', schema: 'WEBFORM' })
export class GPUNA_FORM {
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
    PRODUCT: number;

    @Column()
    QTY: number;

    @Column({ type: 'decimal', precision: 6, scale: 2 })
    UNITPRICE: number;

    @Column({ type: 'decimal', precision: 6, scale: 2 })
    DISCOUNT: number;

    @Column()
    CSTATUS: string;
}
