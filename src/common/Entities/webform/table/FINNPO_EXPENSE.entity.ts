import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'FINNPO_EXPENSE', schema: 'WEBFORM' })
export class FINNPOEXPENSE {
    @PrimaryColumn()
    EXPENSE_CODE: number;

    @PrimaryColumn()
    EXPENSE_ENAME: string;

    @PrimaryColumn()
    EXPENSE_TNAME: string;
    
    @Column()
    ACTIVE: number;

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
