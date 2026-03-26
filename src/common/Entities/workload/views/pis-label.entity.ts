import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'PIS_LABEL', schema: 'WORKLOAD' })
export class PisLabel {
    @ViewColumn()
    FILES_ID: number;

    @ViewColumn()
    PAGE_NUM: number;

    @ViewColumn()
    PAGE_MFGNO: string;

    @ViewColumn()
    PAGE_PACKING: string;

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
    URGETNT: number;

    @ViewColumn()
    JAPAN: number;

    @ViewColumn()
    EARTHQ: number;
}
