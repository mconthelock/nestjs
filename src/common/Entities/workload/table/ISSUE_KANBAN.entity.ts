import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISSUE_KANBAN', schema: 'WORKLOAD' })
export class ISSUE_KANBAN {
    @PrimaryColumn()
    IK_ID: number;

    @Column()
    REQ_SECTION: string;

    @Column()
    REQ_DATE: Date;

    @Column()
    REQ_BY: string;

    @Column()
    PC_CONFIRM_DATE: Date;

    @Column()
    PC_CONFIRM_BY: string;

    @Column()
    PR_NO: string;

    @Column()
    STATUS: string;

    @Column()
    PRODUCT_CAT: number;
}
