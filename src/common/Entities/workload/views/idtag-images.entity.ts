import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'IDTAGS_IMAGES', schema: 'WORKLOAD' })
export class IdtagImages {
    @ViewColumn()
    FILES_ID: number;

    @ViewColumn()
    PAGE_NUM: number;

    @ViewColumn()
    PAGE_TAG: string;

    @ViewColumn()
    PAGE_IMG: string;

    @ViewColumn()
    PAGE_CN: string;

    @ViewColumn()
    PAGE_FRIST: string;

    @ViewColumn()
    PAGE_NC: string;

    @ViewColumn()
    PAGE_STATUS: string;

    @ViewColumn()
    DWG_NO: string;

    @ViewColumn()
    DWG_DESC: string;

    @ViewColumn()
    DWG_WEIGHT: number;

    @ViewColumn()
    DWG_ADDUSR: string;

    @ViewColumn()
    DWG_ADDDATE: string;

    @ViewColumn()
    DWG_IMG: string;

    @ViewColumn()
    DWG_REV: string;

    @ViewColumn()
    DWG_STATUS: string;

    @ViewColumn()
    DWG_WEIGHT_UNIT: string;

    @ViewColumn()
    DWG_UNIT: string;
}
