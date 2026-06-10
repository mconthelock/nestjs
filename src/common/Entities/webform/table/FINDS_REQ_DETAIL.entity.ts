import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'FINDS_REQ_DETAIL', schema: 'WEBFORM' })
export class DSREQDETAIL {
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
    LINEID: number;    

    @Column()
    REASON: string;

    @PrimaryColumn()
    DUTY_VALUE: number;
    
    @Column()
    QTY: number;


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
