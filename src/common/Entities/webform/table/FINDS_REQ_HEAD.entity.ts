import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { FORM } from './FORM.entity';

@Entity({ name: 'FINDS_REQ_HEAD', schema: 'WEBFORM' })
export class DSREQHEAD {
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
    OPTION_CODE: string;

    @Column()
    EFFECTIVE_DATE: Date;

    @Column()
    DATE_RECEIVE: Date;

    @Column()
    LOCATION: string;
}
