import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'FINNPO_VENDOR', schema: 'WEBFORM' })
export class FINNPOVENDOR {
    @PrimaryColumn()
    VENDOR_CODE: string;

    @PrimaryColumn()
    VENDOR_NAME: string;

    @Column()
    ACTIVE: string;
    
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
