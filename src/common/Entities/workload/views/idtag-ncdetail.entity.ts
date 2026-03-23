import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'IDTAGS_NCDATA', schema: 'WORKLOAD' })
export class IdtagNcDetail {
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
    FILES: number;

    @ViewColumn()
    SCHDDATE: Date;

    @ViewColumn()
    SCHDNUMBER: string;

    @ViewColumn()
    SCHDCHAR: string;

    @ViewColumn()
    SCHDP: string;

    @ViewColumn()
    FILE_ONAME: string;

    @ViewColumn()
    FILE_NAME: string;

    @ViewColumn()
    FILE_FOLDER: string;

    @ViewColumn()
    FILE_TOTALPAGE: number;

    @ViewColumn()
    FILE_STATUS: number;

    @ViewColumn()
    CREATE_DATE: Date;

    @ViewColumn()
    PRINTED_DATE: Date;

    @ViewColumn()
    FILE_PRINTEDPAGE: number;

    @ViewColumn()
    TASKNAME: string;

    @ViewColumn()
    PROGRAMNAME: string;

    @ViewColumn()
    SEQNO: number;

    @ViewColumn()
    PARTNO: string;

    @ViewColumn()
    PARTX: string;

    @ViewColumn()
    PARTY: string;

    @ViewColumn()
    QTYREQ: number;

    @ViewColumn()
    QTYNES: number;

    @ViewColumn()
    REVNO: string;

    @ViewColumn()
    CONTROL: string;

    @ViewColumn()
    ORDERNO: string;

    @ViewColumn()
    NEXTPROCESS: string;

    @ViewColumn()
    TAGMARK: string;

    @ViewColumn()
    F01R01: string;

    @ViewColumn()
    F01R02: string;

    @ViewColumn()
    F01R03: string;

    @ViewColumn()
    F01R04: string;

    @ViewColumn()
    F01R05: string;

    @ViewColumn()
    F01R06: string;

    @ViewColumn()
    F01R07: string;

    @ViewColumn()
    F01R08: string;

    @ViewColumn()
    F01R09: string;

    @ViewColumn()
    F01R10: number;

    @ViewColumn()
    F01R11: number;

    @ViewColumn()
    F01R12: number;

    @ViewColumn()
    F01R13: number;

    @ViewColumn()
    F01R14: number;

    @ViewColumn()
    F01R15: number;

    @ViewColumn()
    F01R16: string;

    @ViewColumn()
    F01R17: number;

    @ViewColumn()
    F01R18: string;

    @ViewColumn()
    F01R19: string;

    @ViewColumn()
    FILLER: string;
}
