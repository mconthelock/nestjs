import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'FORM_COUNTER', schema: 'WEBFORM' })
export class FormCounter {
    @PrimaryColumn()
    EMPNO: string;

    @Column()
    WAITFORAPPROVE: number;

    @Column()
    WAITFORAPPROVE_DATE: Date;

    @Column()
    DRAFT: number;

    @Column()
    DRAFT_DATE: Date;

    @Column()
    MINE: number;

    @Column()
    MINE_DATE: Date;

    @Column()
    APPROVED: number;

    @Column()
    APPROVED_DATE: Date;

    @Column()
    COMMING: number;

    @Column()
    COMMING_DATE: Date;
}
