import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'PURVMM_FORM', schema: 'WEBFORM' })
export class PURVMM_FORM {
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
    REQTYPE: string;

    @Column()
    VENDCODE: string;

    @Column()
    VENDNAME: string;

    @Column()
    VENDGROUPTYPE: string;

    @Column()
    TAXID: string;

    @Column()
    CANO: string;

    @Column()
    BANO: string;

    @Column()
    CURCODE: string;

    @Column()
    PAYMENTTYPE: string;

    @Column()
    VENDHOLD: string;

    @Column()
    VENDONETIME: string;

    @Column()
    VEND1099: string;

    @Column()
    TERMCODE: string;

    @Column()
    SEARCHKEY: string;

    @Column()
    FISCALCODE: string;

    @Column()
    ACCNUMBER: string;

    @Column()
    BANKNAME: string;

    @Column()
    BRANCH: string;
}
