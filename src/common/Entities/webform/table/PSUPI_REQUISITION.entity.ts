import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { FORM } from './FORM.entity';
import { User } from '../views/AMECUSERALL.entity';

@Entity({
    name: 'PSUPI_REQUISITION',
    schema: 'WEBFORM',
})
export class PSUPI_REQUISITION {
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
    PUR_CODE: string;

    @Column()
    DESCRIPTION: string;

    @Column()
    DRAWING_NO: string;

    @Column()
    ADDRESS: string;

    @Column()
    WHI_USER: string;

    @Column()
    QUANTITY: number;

    @Column()
    UNIT: string;

    @Column()
    PRODUCTION: string;

    @Column()
    ISSUE_TO: string;

    @Column()
    REASON_CODE: string;

    @Column()
    REASON_REF_NO: string;

    @Column()
    REASON_DETAIL: string;

    @Column()
    PLAN_RETURN_DATE: Date;

    @ManyToOne(() => FORM)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: FORM;

    @OneToOne(() => User)
    @JoinColumn({ name: 'WHI_USER', referencedColumnName: 'SEMPNO' })
    whi_user: User;
}