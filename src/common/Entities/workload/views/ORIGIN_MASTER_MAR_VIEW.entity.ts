import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'ORIGIN_MASTER_MAR_VIEW', schema: 'WORKLOAD' })
export class ORIGIN_MASTER_MAR_VIEW {
    @ViewColumn()
    DRAWING: string;

    @ViewColumn()
    PARTNAME: string;

    @ViewColumn()
    ITEMNO: string;

    @ViewColumn()
    ORIGIN: string;

    @ViewColumn()
    PURCODE: string;

    @ViewColumn()
    MFG_NAME: string;

    @ViewColumn()
    MFG_ADDRESS: string;
}
