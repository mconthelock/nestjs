import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'DPMS_PACKING_LIST', schema: 'WORKLOAD'})
export class DPMS_PACKING_LIST{
    @Column()
    TURNOVER_STATUS: number;

    @PrimaryColumn()
    PRODUCTION: string;

    @PrimaryColumn()
    MFGBM: string;

    @PrimaryColumn()
    PROD: string;

    @PrimaryColumn()
    P: string;

    @PrimaryColumn()
    TYPE: string;

    @Column()
    COUNTRY: string;

    @Column()
    SERIES: string;

    @PrimaryColumn()
    ORDERS: string;

    @Column()
    PROJECT: string;

    @Column()
    PRJ_NO: string;

    @Column()
    VANNING: Date;

    @Column()
    PLAN_PACKING: Date;

    @Column()
    SERIESNAME: string;

    @Column()
    PL_PLAN: Date;

    @Column()
    QCDATE: Date;

    @Column()
    DCDATE: Date;

    @Column()
    SHIPPING_MARK: Date;

    @Column()
    WEIGHT: string;

    @Column()
    COMBINE: string;

    @Column()
    REQUEST_PARTIAL: string;

    @Column()
    SHOP_ORDER_NO: string;

    @Column()
    SUBJECT: string;

    @Column()
    NAME_OF_BLDG: string;

    @Column()
    SOLD_TO: string;

    @Column()
    MODEL_SPEC: string;

    @Column()
    DELAY: string;

    @Column()
    DFINISHALL: Date;

    @Column()
    DCOMPLETE: string;

    @Column()
    DDRAFT: string;

    @Column()
    DPARTIAL: string;

    @Column()
    DCOMBINE: string;

    @Column()
    DBALANCE: string;

    @Column()
    VPROBLEM: string;

    @Column()
    VREASON: string;
    
    @Column()
    REVISE: string;
}