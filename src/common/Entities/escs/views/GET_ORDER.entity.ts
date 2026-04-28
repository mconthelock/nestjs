import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'GET_ORDER',
    schema: 'ESCCHKSHT',
})
export class GET_ORDER {
    @ViewColumn()
    ORD_PRODUCTION: string;

    @ViewColumn()
    ORD_P: string;

    @ViewColumn()
    ORD_ITEM: string;

    @ViewColumn()
    ORD_NO: string;

    @ViewColumn()
    ORD_MODEL: string;

    @ViewColumn()
    ORD_PROJECT: string;

    @ViewColumn()
    ORD_STATUS: number;

    @ViewColumn()
    ORT_ID: number;

    @ViewColumn()
    ORD_REMARK: string;

    @ViewColumn()
    SEC_ID: number;

    @ViewColumn()
    ORD_STATUSDETAIL: string;

    @ViewColumn()
    ORDDW_ID: number;

    @ViewColumn()
    ORDDW_NO: string;

    @ViewColumn()
    ORDDW_QTY: string;

    @ViewColumn()
    ORDDW_PART: string;

    @ViewColumn()
    ORDDW_DRAWING: string;

    @ViewColumn()
    ORDDW_STATION: string;

    @ViewColumn()
    ORDDW_VARIABLE: string;

    @ViewColumn()
    ORDDW_APREMARK: string;

    @ViewColumn()
    ORDDW_FILENAME: string;

    @ViewColumn()
    ITEM_COMBINE: string;

    @ViewColumn()
    ORDDW_STATUS: number;

    @ViewColumn()
    STATUS_IN: string;

    @ViewColumn()
    STATUS_IN_NUM: number;

    @ViewColumn()
    STATUS_FL: string;

    @ViewColumn()
    STATUS_FL_NUM: number;

    @ViewColumn()
    ORDER_ID: string;

    @ViewColumn()
    TYPE_MODEL: string;

    @ViewColumn()
    SGTYPE: string;

    @ViewColumn()
    IT_PATH: string;

    @ViewColumn()
    FDP_DESCRIPTION: string;
}
