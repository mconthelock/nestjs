import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ORDERS_DRAWING', schema: 'ESCCHKSHT' })
export class ORDERS_DRAWING {
    @PrimaryColumn()
    ORD_PRODUCTION: string;

    @PrimaryColumn()
    ORD_NO: string;

    @PrimaryColumn()
    ORD_ITEM: string;

    @PrimaryColumn()
    ORDDW_ID: number;

    @Column()
    ORDDW_NO: string;

    @Column()
    ORDDW_PART: string;

    @Column()
    ORDDW_DRAWING: string;

    @Column()
    ORDDW_VARIABLE: string;

    @Column()
    ORDDW_APREMARK: string;

    @Column()
    ORDDW_SCNDPRTCLS: string;

    @Column()
    ORDDW_SUPPLYCLS: string;

    @Column()
    ORDDW_QTY: string;

    @Column()
    ORDDW_INSPECTOR_STATUS: number;

    @Column()
    ORDDW_FORELEAD_STATUS: number;

    @Column()
    ORDDW_USERCREATE: number;

    @Column()
    ORDDW_DATECREATE: Date;

    @Column()
    ORDDW_USERUPDATE: number;

    @Column()
    ORDDW_DATEUPDATE: Date;

    @Column()
    ORDDW_FILENAME: string;

    @Column()
    ORDDW_STATUS: number;

    @Column()
    ITEM_COMBINE: string;

    @Column()
    ORDDW_SERIAL: string;

    @Column()
    ORDDW_CAPTURE: number;

    @Column()
    ORDDW_STATION: string;
}
