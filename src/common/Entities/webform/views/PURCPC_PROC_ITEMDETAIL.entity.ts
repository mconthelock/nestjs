import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'PURCPC_PROC_ITEMDETAIL', schema: 'WEBFORM' })
export class PURCPC_PROC_ITEMDETAIL {
    @ViewColumn()
    ITEM_CODE: string;

    @ViewColumn()
    JOB_ITEMNO: string;

    @ViewColumn()
    PART_NAME: string;

    @ViewColumn()
    DRAWING: string;

    @ViewColumn()
    SPEC: string;

    @ViewColumn()
    MATERIAL_CODE: string;

    @ViewColumn()
    VENDOR: string;

    @ViewColumn()
    VENDOR_NAME: string;
}
