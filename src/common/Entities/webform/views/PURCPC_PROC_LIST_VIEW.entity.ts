import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'PURCPC_PROC_LIST_VIEW', schema: 'WEBFORM' })
export class PURCPC_PROC_LIST_VIEW {
    @ViewColumn()
    VPLANNER_CODE: string;

    @ViewColumn()
    VPROD_CODE: string;

    @ViewColumn()
    VPROD_NAME: string;

    @ViewColumn()
    VDESCRIPTION: string;

    @ViewColumn()
    VPRES_VENDOR: string;

    @ViewColumn()
    VPRES_VENDOR_NAME: string;

    @ViewColumn()
    VSEXPTYPE: string;
}
