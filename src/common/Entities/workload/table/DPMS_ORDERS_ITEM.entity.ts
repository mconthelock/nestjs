import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_ORDERS_ITEM', schema: 'WORKLOAD' })
export class DpmsOrdersItem {
    @PrimaryColumn()
    ORDERNO: string;

    @PrimaryColumn()
    ITEMNO: string;

    @Column()
    PIS_ISSUEDATE: Date;

    @Column()
    PIS_RECEIVEDATE: Date;

    @Column()
    PB_CODE: string;

    @Column()
    PB_DETAIL: string;

    @Column()
    PB_USER: string;

    @Column()
    PB_DATE: Date;

    @Column()
    ITEM_ACCEPT_USER: string;

    @Column()
    ITEM_ACCEPT_DATE: Date;

    @Column()
    ITEM_ACCEPT_REMARK: string;

    @Column()
    USER_UPDATE: string;

    @Column()
    DATE_UPDATE: Date;
}
