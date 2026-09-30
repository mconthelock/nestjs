import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'PURCPC_FORM_LISTS_VIEW', schema: 'WEBFORM' })
export class PURCPC_FORM_LISTS_VIEW {
    @ViewColumn()
    VFORMNO: string;

    @ViewColumn()
    VREQNO: string;

    @ViewColumn()
    VREQBY_NAME: string;

    @ViewColumn()
    VINPUTER: string;

    @ViewColumn()
    VINPUTBY_NAME: string;

    @ViewColumn()
    VPLANNER_CODE: string;

    @ViewColumn()
    CMODE: string;
    
    @ViewColumn()
    VVENDOR: string;

    @ViewColumn()
    NAMOUNT_PRESENT: number;

    @ViewColumn()
    NAMOUNT_NEW: number;

    @ViewColumn()
    NAMOUNT_DIFF: number;

    @ViewColumn()
    NRATIO: number;

    @ViewColumn()
    DREQDATE: Date;

    @ViewColumn()
    NFUNCTIONS: number;

    @ViewColumn()
    NSTATUS: number;

    @ViewColumn()
    VSTATUS: string;

    @ViewColumn()
    VSYSTEM: string;
}
