import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'DPMS_PL_ORIGIN_VIEW', schema: 'WORKLOAD' })
export class DPMS_PL_ORIGIN_VIEW {
    @ViewColumn()
    NISSUEREV_ID: number;

    @ViewColumn()
    NPOID: number;

    @ViewColumn()
    DISSUEDATE: Date;

    @ViewColumn()
    VPROD: string;

    @ViewColumn()
    VP: string;

    @ViewColumn()
    VTYPE: string;

    @ViewColumn()
    VMFGNO: string;

    @ViewColumn()
    VITEM: string;

    @ViewColumn()
    NSEQ: number;

    @ViewColumn()
    VCASE: string;

    @ViewColumn()
    VPACKSTYLE: string;

    @ViewColumn()
    NNETWEIGHT: number;

    @ViewColumn()
    NGROSSWEIGHT: number;

    @ViewColumn()
    VWIDTH: string;

    @ViewColumn()
    VLENGTH: string;

    @ViewColumn()
    VHEIGHT: string;

    @ViewColumn()
    VPART: string;

    @ViewColumn()
    VDRAWING: string;

    @ViewColumn()
    VDRAWINGL: string;

    @ViewColumn()
    NQTY: number;

    @ViewColumn()
    VORIGIN: string;

    @ViewColumn()
    VSHIPPINGMARK: string;

    @ViewColumn()
    LAST_REVISION: number;
}
