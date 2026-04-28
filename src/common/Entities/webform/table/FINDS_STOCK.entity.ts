import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'FINDS_ATTACH', schema: 'WEBFORM' })
export class DSSTOCK {
    @PrimaryColumn()
    FISCAL_YEAR : string;

    @Column()
    DATE_RECEIVE: string;

    @Column()
    DUTY_VALUE: number;
    
    @Column()
    OPTION_CODE: string;

    @Column()
    IN_QTY: number;

    @Column()
    IN_AMOUNT: number;

    @Column()
    OUT_QTY: number;

    @Column()
    OUT_AMOUNT: number;

    @Column()
    BAL_QTY: number;

    @Column()
    BAL_AMOUNT: number;

}
    // FISCAL_YEAR 
    // DATE_RECEIVE
    // DUTY_VALUE
    // OPTION_CODE
    // IN_QTY
    // IN_AMOUNT
    // OUT_QTY
    // OUT_AMOUNT
    // BAL_QTY 
    // BAL_AMOUNT
