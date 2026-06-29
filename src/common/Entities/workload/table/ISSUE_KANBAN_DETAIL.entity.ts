import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ISSUE_KANBAN_DETAIL', schema: 'WORKLOAD' })
export class ISSUE_KANBAN_DETAIL {
    @PrimaryColumn()
    IKD_ID: number;

    @Column()
    IK_ID: number;

    @Column()
    ITEM_CODE: string;

    @Column()
    QTY_REQ: number;

    @Column()
    PKC_SEND_DATE: Date;

    @Column()
    PKC_SEND_BY: string;

    @Column()
    MFG_RECEIVE_DATE: Date;

    @Column()
    MFG_RECEIVE_BY: string;

    @Column()
    QTY_RECEIVE: number;

    @Column()
    REMARK: string;

    @Column()
    QTY_CON: number;

    @Column()
    PC_EDIT: string;

    @Column()
    QTY_PR: number;
}
