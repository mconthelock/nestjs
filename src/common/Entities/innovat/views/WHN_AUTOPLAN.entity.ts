import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'WHN_AUTOPLAN',
    schema: 'INNOVAT',
})
export class WHN_AUTOPLAN {
    @ViewColumn()
    ITEM_NO: string;

    @ViewColumn()
    ITEM_PROCESS: string;

    @ViewColumn()
    PRODNO: string;

    @ViewColumn()
    PROD: string;

    @ViewColumn()
    P: string;

    @ViewColumn()
    CTRLNO: string;

    @ViewColumn()
    MFGNO: string;

    @ViewColumn()
    PROJ: string;

    @ViewColumn()
    MODEL: string;

    @ViewColumn()
    DWG: string;

    @ViewColumn()
    QTY: number;

    @ViewColumn()
    ITEMCODE: string;

    @ViewColumn()
    CUT: number;

    @ViewColumn()
    REMARK: string;

    @ViewColumn()
    RNO: string;

    @ViewColumn()
    CABLE: string;
}