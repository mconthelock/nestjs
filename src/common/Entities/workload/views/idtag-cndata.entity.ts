import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'IDTAGS_CNDATA', schema: 'WORKLOAD' })
export class IdtagCnData {
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
    DOCNO: string;

    @ViewColumn()
    DWG: string;

    @ViewColumn()
    ORDERNO: string;

    @ViewColumn()
    ITEMNO: number;

    @ViewColumn()
    PRDCTNAME: string;

    @ViewColumn()
    SENTTO: string;
}
