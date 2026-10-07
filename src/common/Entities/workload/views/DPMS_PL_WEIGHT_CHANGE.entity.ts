import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'DPMS_PL_WEIGHT_CHANGE',
    schema: 'WORKLOAD',
})
export class DPMS_PL_WEIGHT_CHANGE {
    @ViewColumn()
    NISSUEREV_ID: number;

    @ViewColumn()
    NPOID: number;

    @ViewColumn()
    VPROD: string;

    @ViewColumn()
    VP: string;

    @ViewColumn()
    VMFGNO: string;

    @ViewColumn()
    PLTYPE: string;

    @ViewColumn()
    REVISION: string;

    @ViewColumn()
    WEIGHTCHANGE: string;

    @ViewColumn()
    VANNING: Date;

    @ViewColumn()
    SHOPORDER: string;

    @ViewColumn()
    SUBJECT: string;

    @ViewColumn()
    PROJECT: string;
}
