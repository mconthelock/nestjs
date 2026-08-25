import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'FINNPO_INVOICE', schema: 'WEBFORM' })
export class FINNPOINVOICE {
    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @PrimaryColumn()
    ID: number;

    @PrimaryColumn()
    INVOICE_DATE: Date;

    @PrimaryColumn()
    INVOICE_NO: string;

    @Column()
    NET_PRICE: number;

    @PrimaryColumn()
    VAT_RATE_ID: number;

    @Column()
    TOTAL_AMT: number;

    @Column({ type: 'decimal', nullable: true })
    WHT: number | null;

    @PrimaryColumn()
    SCURCODE: string;
}

// NFRMNO
// VORGNO
// CYEAR
// CYEAR2
// NRUNNO

// LINEID
// REASON
// DUTY_VALUE
// QTY
