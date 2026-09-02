import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'MATERIAL_STATUS_INQUIRY_VIEW', schema: 'WORKLOAD' })
export class MATERIAL_STATUS_INQUIRY_VIEW {
    @ViewColumn()
    STATUS: string;

    @ViewColumn()
    ITEM: string;

    @ViewColumn()
    PARTNAME: string;

    @ViewColumn()
    GROUPCODE: string;

    @ViewColumn()
    CLASS: string;

    @ViewColumn()
    TYPE: string;

    @ViewColumn()
    REFDESC: string;

    @ViewColumn()
    EXTRADESC: string;

    @ViewColumn()
    UMSALE: string;

    @ViewColumn()
    UMSTOCK: string;

    @ViewColumn()
    UMPURCH: string;

    @ViewColumn()
    YIELD: number;

    @ViewColumn()
    DRAW_FORMULA: string;

    @ViewColumn()
    OPEN_BALANCE: number;

    @ViewColumn()
    MINIMUM_BALANCE: number;

    @ViewColumn()
    ISSUES_MTD: number;

    @ViewColumn()
    ISSUES_YTD: number;

    @ViewColumn()
    RECEIPTS_MTD: number;

    @ViewColumn()
    RECEIPTS_YTD: number;

    @ViewColumn()
    ADJUSTMENTS_MTD: number;

    @ViewColumn()
    ADJUSTMENTS_YTD: number;

    @ViewColumn()
    SALEUNIT_MTD: number;

    @ViewColumn()
    SALEUNIT_YTD: number;

    @ViewColumn()
    SALEAMOUNT_MTD: number;

    @ViewColumn()
    SALEAMOUNT_YTD: number;

    @ViewColumn()
    ADDRESS: string;

    @ViewColumn()
    LISTPRICE: number;

    @ViewColumn()
    STANDARD_COST: number;

    @ViewColumn()
    ACTUAL_COST: number;

    @ViewColumn()
    DISCOUNT_CODE: string;

    @ViewColumn()
    PURCHUM_CNV: number;

    @ViewColumn()
    SALEUM_CNV: number;

    @ViewColumn()
    LOT_SIZE: number;

    @ViewColumn()
    BATCH_SIZE: number;

    @ViewColumn()
    DAILY_TIME_RATE: number;

    @ViewColumn()
    FIXED_TIME_DAYS: number;

    @ViewColumn()
    ORDER_POLICY_CODE: string;

    @ViewColumn()
    HORIZON_DAYS: number;

    @ViewColumn()
    PERIOD_ORDER_DAYS: number;

    @ViewColumn()
    VENDOR: number;

    @ViewColumn()
    VENDOR_NAME: string;

    @ViewColumn()
    BUYER_CODE: string;

    @ViewColumn()
    BUYER: string;

    @ViewColumn()
    BUYERNAME: string;

    @ViewColumn()
    PLANNER: string;

    @ViewColumn()
    ONHAND: number;

    @ViewColumn()
    MFG_ALLOC: number;

    @ViewColumn()
    AVAILABLE: number;

    @ViewColumn()
    COUNTRY: string;

    @ViewColumn()
    ORIGIN_TYPE: number;

    @ViewColumn()
    MFG_NAME: string;

    @ViewColumn()
    MFG_ADDRESS: string;
}
