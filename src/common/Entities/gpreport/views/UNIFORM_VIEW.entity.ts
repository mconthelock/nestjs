import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({ name: 'UNIFORM_VIEW', schema: 'GPREPORT' })
export class UNIFORM_VIEW {
    @ViewColumn()
    NFRMNO: number;

    @ViewColumn()
    VORGNO: string;

    @ViewColumn()
    CYEAR: string;

    @ViewColumn()
    CYEAR2: string; 

    @ViewColumn()
    NRUNNO: number;

    @ViewColumn()
    REQUEST_TYPE: string;

    @ViewColumn()
    REQUEST_PPE_TYPE: number;

    @ViewColumn()
    UNIFORM_TYPE: number;

    @ViewColumn()
    UNIFORM_CATEGORY: number;

    @ViewColumn()
    QTY: number;

    @ViewColumn()
    JOB: string;

    @ViewColumn()
    ATTACH_FILE: string;

    @ViewColumn()
    EMP_INPUT: string;

    @ViewColumn()
    EMP_REQUEST: string;

    @ViewColumn()
    RT_DETAIL: string;

    @ViewColumn()
    CATNAME: string;

    @ViewColumn()
    CATDESC: string;

    @ViewColumn()
    PROD_CODE: string;

    @ViewColumn()
    CATUNIT: string;

    @ViewColumn()
    PROD_SIZES: string;

    @ViewColumn()
    CREATE_DATE: Date;

    @ViewColumn()
    EMP_IN_NAME: string;

    @ViewColumn()
    EMP_REQ_NAME: string;

    @ViewColumn()
    UNIFORM_OLD_TYPE: number;

    @ViewColumn()
    OLD_SIZE: string;

    @ViewColumn()
    PROD_PRICE: number;

    @ViewColumn()
    URD_ID: number;

    @ViewColumn()
    CONFIRMED: string;
}
