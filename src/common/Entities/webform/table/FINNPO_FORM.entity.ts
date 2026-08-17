import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'FINNPO_FORM', schema: 'WEBFORM' })
export class FINNPOFORM {

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
    SUBJECT: string;

    @Column()
    VENDOR_CODE: string;

    @Column()
    EXPENSE_CODE: number;
    
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
