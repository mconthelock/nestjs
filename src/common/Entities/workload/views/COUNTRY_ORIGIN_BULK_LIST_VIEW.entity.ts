import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'COUNTRY_ORIGIN_BULK_LIST_VIEW', schema: 'WORKLOAD' })
export class COUNTRY_ORIGIN_BULK_LIST_VIEW {
    @ViewColumn()
    PLANNER: string;

    @ViewColumn()
    BULK_CODE: string;

    @ViewColumn()
    DRAWING: string;

    @ViewColumn()
    PARTNAME: string;

    @ViewColumn()
    VENDOR: number;

    @ViewColumn()
    VENDOR_NAME: string;

    @ViewColumn()
    COUNTRY: string;

    @ViewColumn()
    MFG_NAME: string;

    @ViewColumn()
    MFG_ADDRESS: string;

    @ViewColumn()
    TRADING: string;

    @ViewColumn()
    PROCESS: string;

    @ViewColumn()
    MANUFACTURER: string;
}
