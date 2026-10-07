import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'CURRENCY', schema: 'WEBFORM' })
export class FINNPOCURRENCY  {
    
    @PrimaryColumn()
    CURRENCY: string;

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
