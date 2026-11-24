import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURPO_FORM', schema: 'WEBFORM' })
export class PURPO_FORM {
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
    ORD_ID: number;

    @Column()
    ORD_PONO: string;

    @Column()
    ORD_DOCREV: number;

    @Column()
    ORD_REVISION: number;

    @Column()
    ORD_TYPE: number;

    @Column()
    VENDORCODE: string;

    @Column()
    VENDOR_NAME: string | null;

    @Column()
    ORD_AMOUNT: number;

    @Column()
    ORD_CURRENCY: string;

    @Column()
    BUYER_EMPNO: string | null;

    @Column()
    IS_REVISE: number;

    @Column()
    REMARK: string | null;

    @Column()
    CREATED_AT: Date | null;

    @Column()
    UPDATED_AT: Date | null;
}
