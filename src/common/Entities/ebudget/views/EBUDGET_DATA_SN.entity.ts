import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({name: 'EBUDGET_DATA_SN', schema: 'EBUDGET'})
export class EBUDGET_DATA_SN {
    @ViewColumn()
    FYEAR: string;

    @ViewColumn()
    SN: string;

    @ViewColumn()
    ITEM: string;

    @ViewColumn()
    VORGCODE: string;

    @ViewColumn()
    ORG: string;

    @ViewColumn()
    P: number;

    @ViewColumn()
    A: number;

    @ViewColumn()
    CSTATUS: string;
}