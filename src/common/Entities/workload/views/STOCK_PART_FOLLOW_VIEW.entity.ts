import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'STOCK_PART_FOLLOW_VIEW', schema: 'WORKLOAD' })
export class STOCK_PART_FOLLOW_VIEW {
    @ViewColumn()
    ITEM: string;

    @ViewColumn()
    PARTNAME: string;

    @ViewColumn()
    DRAWING: string;

    @ViewColumn()
    ONHAND: number;

    @ViewColumn()
    SCHDMFG_N0: string;

    @ViewColumn()
    QTY_N0: number;

    @ViewColumn()
    SCHDMFG_N1: string;

    @ViewColumn()
    QTY_N1: number;

    @ViewColumn()
    SCHDMFG_N2: string;

    @ViewColumn()
    QTY_N2: number;

    @ViewColumn()
    SCHDMFG_N3: string;

    @ViewColumn()
    QTY_N3: number;

    @ViewColumn()
    SCHDMFG_N4: string;

    @ViewColumn()
    QTY_N4: number;

    @ViewColumn()
    SCHDMFG_N5: string;

    @ViewColumn()
    QTY_N5: number;

    @ViewColumn()
    ALLOCATE: number;

    @ViewColumn()
    PROD: string;

    @ViewColumn()
    IDTAG: string;

    @ViewColumn()
    QTY: number;

    @ViewColumn()
    PROCESS: string;

    @ViewColumn()
    PLAN: number;

    @ViewColumn()
    ACTUAL: number;

    @ViewColumn()
    INCHARGE: string;

    @ViewColumn()
    REMARK: string;

    @ViewColumn()
    STOCK_ACTUAL_QTY: number;

    @ViewColumn()
    STOCK_QTY: number;
}
