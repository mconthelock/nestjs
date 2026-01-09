import { View, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({name: 'EBUDGET_DATA_BIDDING', schema: 'EBUDGET'})
export class EBUDGET_DATA_BIDDING {
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
    FORMNO: string;

    @ViewColumn()
    INPUT_BY: string;

    @ViewColumn()
    REQUEST_BY: string;

    @ViewColumn()
    PROJECT: string;

    @ViewColumn()
    PROJECT_DETAIL: string;

    @ViewColumn()
    VREQNO: string;

    @ViewColumn()
    VINPUTER: string;
}
