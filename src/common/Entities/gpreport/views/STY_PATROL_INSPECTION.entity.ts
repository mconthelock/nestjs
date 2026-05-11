import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({
    name: 'STY_PATROL_INSPECTION',
    schema: 'GPREPORT',
})
export class STY_PATROL_INSPECTION {
    @ViewColumn()
    FORMNO: string;

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
    PA_ID: number;

    @ViewColumn()
    PA_SECTION: string;

    @ViewColumn()
    OWNER_SECTION: string;

    @ViewColumn()
    PA_OWNER: string;

    @ViewColumn()
    STNAME: string;

    @ViewColumn()
    SNAME: string;

    @ViewColumn()
    SSEC: string;

    @ViewColumn()
    SDEPT: string;

    @ViewColumn()
    SDIV: string;

    @ViewColumn()
    SSECCODE: string;

    @ViewColumn()
    SDEPCODE: string;

    @ViewColumn()
    SDIVCODE: string;

    @ViewColumn()
    PA_DATE: Date;

    @ViewColumn()
    PA_AUDIT: string;

    @ViewColumn()
    ITEMS_NAME: string;

    @ViewColumn()
    ITEMS_ENAME: string;

    @ViewColumn()
    PA_AREA: string;

    @ViewColumn()
    PA_DETECTED: string;

    @ViewColumn()
    PA_CLASS: number;

    @ViewColumn()
    CLASS: string;

    @ViewColumn()
    PA_SUGGESTION: string;

    @ViewColumn()
    PA_MAT: number;

    @ViewColumn()
    IMAGE_ONAME: string;

    @ViewColumn()
    IMAGE_FNAME: string;

    @ViewColumn()
    IMAGE_PATH: string;

    @ViewColumn()
    PA_EMP_CORRECTIVE: string;

    @ViewColumn()
    PA_CORRECTIVE: string;

    @ViewColumn()
    PA_FINISH_DATE: Date;

    @ViewColumn()
    PA_IMAGE: number;

    @ViewColumn()
    PA_IMAGE_AFTER: number;

    @ViewColumn()
    IMAGE_AFTER_ONAME: string;

    @ViewColumn()
    IMAGE_AFTER_FNAME: string;

    @ViewColumn()
    IMAGE_AFTER_PATH: string;

    @ViewColumn()
    PA_MORNING_TALK: Date;

    @ViewColumn()
    PA_AUDIT_EVALUATE: number;

    @ViewColumn()
    CST: string;

    @ViewColumn()
    ITEMS_ID: number;
}
