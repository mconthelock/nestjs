import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'STY_CHM_SEC', schema: 'GPREPORT' })
export class STY_CHM_SEC {
    @ViewColumn()
    OWNERCODE: string;

    @ViewColumn()
    OWNER: string;

    @ViewColumn()
    AMEC_SDS_ID: number;

    @ViewColumn()
    RECEIVED_SDS_DATE: Date;

    @ViewColumn()
    EFFECTIVE_DATE: Date;

    @ViewColumn()
    PRODUCT_CODE: string;

    @ViewColumn()
    CHEMICAL_NAME: string;

    @ViewColumn()
    VENDOR: string;

    @ViewColumn()
    PUR_INCHARGE: string;

    @ViewColumn()
    USED_FOR: string;

    @ViewColumn()
    USED_AREA: string;

    @ViewColumn()
    KEEPING_POINT: string;

    @ViewColumn()
    QTY: number;

    @ViewColumn()
    REC4052: number;

    @ViewColumn()
    REC4054: number;

    @ViewColumn()
    REV: string;

    @ViewColumn()
    CLASS: number;

    @ViewColumn()
    CLASSNAME: string;

    @ViewColumn()
    CLASS_DETAIL: string;

    @ViewColumn()
    STATUS: number;

    @ViewColumn()
    QUANTITY_KG: number;

    @ViewColumn()
    QUANTITY_TYPE: number;

    @ViewColumn()
    LAYOUT_FILE: number;

    @ViewColumn()
    LONAME: string;

    @ViewColumn()
    LFNAME: string;

    @ViewColumn()
    LAW: string;

    @ViewColumn()
    HEALTH: number;

    @ViewColumn()
    BEI: string;

    @ViewColumn()
    ENVIRONMENT: number;

    @ViewColumn()
    EVM_PARAMETER: string;

    @ViewColumn()
    PPE: number;

    @ViewColumn()
    PPE_EQUIPMENT: string;

    @ViewColumn()
    SPECIAL_CONTROLLER: number;

    @ViewColumn()
    FIRE_EQUIPMENT: string;

    @ViewColumn()
    EFC_WASTE: number;

    @ViewColumn()
    EFC_RESULT: number;

    @ViewColumn()
    EFC_REASON: string;

    @ViewColumn()
    PUR_CODE: string;

    @ViewColumn()
    SDS_FILE: number;

    @ViewColumn()
    SONAME: string;

    @ViewColumn()
    SFNAME: string;

    @ViewColumn()
    VENDORCODE: string;

    @ViewColumn()
    VENDOR_ADDRESS: string;

    @ViewColumn()
    VENDOR_TAX_NO: string;

    @ViewColumn()
    HAZARDOUS: number;

    @ViewColumn()
    CAS_NO: string;

    @ViewColumn()
    SUBSTANCE_NAME: string;

    @ViewColumn()
    SUBSTANCE_WEIGHT: number;

    @ViewColumn()
    SUBSTANCE_TYPE: number;

    @ViewColumn()
    CARCINOGENS: number;

    @ViewColumn()
    CARCINOGENS_DETAIL: string;

    @ViewColumn()
    CARCINOGENS_TYPE: number;

    @ViewColumn()
    USER_APPROVE: string;

    @ViewColumn()
    APPROVE_DATE: Date;

    @ViewColumn()
    USER_CONTROL: string;

    @ViewColumn()
    MASTER_REV: string;
}
