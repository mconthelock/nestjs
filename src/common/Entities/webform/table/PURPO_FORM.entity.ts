import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURPO_FORM', schema: 'WEBFORM' })
export class PURPO_FORM {
    @PrimaryColumn({ name: 'NFRMNO', type: 'int' })
    NFRMNO: number;

    @PrimaryColumn({ name: 'VORGNO', type: 'varchar', length: 20 })
    VORGNO: string;

    @PrimaryColumn({ name: 'CYEAR', type: 'varchar', length: 4 })
    CYEAR: string;

    @PrimaryColumn({ name: 'CYEAR2', type: 'varchar', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ name: 'NRUNNO', type: 'int' })
    NRUNNO: number;

    @Column({ name: 'ORD_ID', type: 'int' })
    ORD_ID: number;

    @Column({ name: 'ORD_PONO', type: 'varchar', length: 32 })
    ORD_PONO: string;

    @Column({ name: 'ORD_DOCREV', type: 'int', default: 1 })
    ORD_DOCREV: number;

    @Column({ name: 'ORD_REVISION', type: 'int', default: 0 })
    ORD_REVISION: number;

    @Column({ name: 'ORD_TYPE', type: 'int' })
    ORD_TYPE: number;

    @Column({ name: 'VENDORCODE', type: 'varchar', length: 20 })
    VENDORCODE: string;

    @Column({ name: 'VENDOR_NAME', type: 'varchar', length: 255, nullable: true })
    VENDOR_NAME: string | null;

    @Column({ name: 'ORD_AMOUNT', type: 'decimal', precision: 18, scale: 4, default: 0 })
    ORD_AMOUNT: number;

    @Column({ name: 'ORD_CURRENCY', type: 'varchar', length: 10, default: 'THB' })
    ORD_CURRENCY: string;

    @Column({ name: 'BUYER_EMPNO', type: 'varchar', length: 20, nullable: true })
    BUYER_EMPNO: string | null;

    @Column({ name: 'IS_REVISE', type: 'int', default: 0 })
    IS_REVISE: number;

    @Column({ name: 'REMARK', type: 'varchar', length: 1000, nullable: true })
    REMARK: string | null;

    @Column({ name: 'CREATED_AT', type: 'datetime', nullable: true })
    CREATED_AT: Date | null;

    @Column({ name: 'UPDATED_AT', type: 'datetime', nullable: true })
    UPDATED_AT: Date | null;
}
