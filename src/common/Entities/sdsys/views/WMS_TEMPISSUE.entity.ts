import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'WMS_TEMPISSUE',
    schema: 'SDSYS',
})
export class WMS_TEMPISSUE {
    @ViewColumn()
    USERID: string;

    @ViewColumn()
    STATUS: string;

    @ViewColumn()
    ISSUE: string;

    @ViewColumn()
    ISSUEDATE: string;

    @ViewColumn()
    ISSUESET: string;

    @ViewColumn()
    ITEMCODE: string;

    @ViewColumn()
    ONHAND: number;

    @ViewColumn()
    DRAWING: string;

    @ViewColumn()
    ITEM: string;

    @ViewColumn()
    DESCRIPTION: string;

    @ViewColumn()
    PROD: string;

    @ViewColumn()
    LOCATION: string;

    @ViewColumn()
    QTY: number;

    @ViewColumn()
    ISSUETO: string;

    @ViewColumn()
    RECEIVE_DATE: string;

    @ViewColumn()
    PROD_DATE: string;

    @ViewColumn()
    LOT: string;

    @ViewColumn()
    PO: string;

    @ViewColumn()
    LINE: string;

    @ViewColumn()
    INV: string;

    @ViewColumn()
    PALLET_ID: string;

    @ViewColumn()
    COM_NAME: string;

    @ViewColumn()
    LOGIN_NAME: string;

    @ViewColumn()
    TIMESTMP: Date;

    @ViewColumn()
    EXPIRE_DATE: string;

    @ViewColumn()
    RIDPRINT: string;
}