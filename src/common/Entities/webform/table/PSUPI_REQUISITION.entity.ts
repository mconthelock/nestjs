import { Column, Entity, PrimaryColumn } from 'typeorm';

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

    @Column()
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
}