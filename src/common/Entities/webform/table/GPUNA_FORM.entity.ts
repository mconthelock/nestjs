import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'GPUNA_FORM', schema: 'WEBFORM' })
export class GPUNA_FORM {
    @Column()
    NFRMNO: number;

    @Column()
    VORGNO: string;

    @Column()
    CYEAR: string;

    @Column()
    CYEAR2: string;

    @Column()
    NRUNNO: number;

    @Column()
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
