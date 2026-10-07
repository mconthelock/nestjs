import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'WHN_AUTOPLAN',
    schema: 'INNOVAT',
})
export class WHN_AUTOPLAN {
    @ViewColumn()
    ITEMNO: string;

    @ViewColumn()
    PACKNO: string;

    @ViewColumn()
    PROCESS: string;

    @ViewColumn()
    PRODNO: string;

    @ViewColumn()
    PROD: string;

    @ViewColumn()
    P: string;

    @ViewColumn()
    SEQBM: number;

    @ViewColumn()
    CTRLNO: string;

    @ViewColumn()
    MFGNO: string;

    @ViewColumn()
    PROJ: string;

    @ViewColumn()
    MODEL: string;

    @ViewColumn()
    DRAWING: string;

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

    @ViewColumn()
    VANPLAN: string;

    @ViewColumn()
    ACTION: number;
}