import { Entity, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('MATRIX_EFFECT_ITEM_VIEW')
export class MatrixEffectView {
    @ViewColumn()
    ITEM_ID: number;

    @ViewColumn()
    ITEMNO: string;

    @ViewColumn()
    TITLE: string;

    @ViewColumn()
    SECID: number;

    @ViewColumn()
    EFT_ID: number;

    @ViewColumn()
    EFT_ITEMNO: string;

    @ViewColumn()
    EFT_TITLE: string;

    @ViewColumn()
    EFT_SECID: number;
}
