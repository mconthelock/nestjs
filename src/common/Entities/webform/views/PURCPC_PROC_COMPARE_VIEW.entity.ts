import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'PURCPC_PROC_COMPARE_VIEW', schema: 'WEBFORM' })
export class PURCPC_PROC_COMPARE_VIEW {
    @ViewColumn()
    VITEM_CODE: string;

    @ViewColumn()
    VJOB_ITEMNO: string;

    @ViewColumn()
    VPART_NAME: string;

    @ViewColumn()
    VDRAWING: string;

    @ViewColumn()
    VSPEC: string;

    @ViewColumn()
    VMATERIAL_CODE: string;

    @ViewColumn()
    NQUANTITY_YEAR: number;

    @ViewColumn()
    VPRES_VENDOR: string;

    @ViewColumn()
    VPRES_VENDOR_NAME: string;

    @ViewColumn()
    VPRES_MAKER: string;

    @ViewColumn()
    NPRES_BASE_PRICE: number;

    @ViewColumn()
    VPRES_BASE_CURR: string;

    @ViewColumn()
    NPRES_BASE_CURRENCY: number;

    @ViewColumn()
    NPRES_PRICE: number;

    @ViewColumn()
    VPRES_PRICE_CURR: string;

    @ViewColumn()
    NPRES_PRICE_CURRENCY: number;

    @ViewColumn()
    NPRES_PRICE_ETA_AMEC: number;

    @ViewColumn()
    NPRES_AMOUNT: number;

    @ViewColumn()
    NFYEAR: number;
}
