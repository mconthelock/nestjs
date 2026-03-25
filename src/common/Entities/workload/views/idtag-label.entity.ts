import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'IDTAGS_LABEL', schema: 'WORKLOAD' })
export class IdtagLabel {
    @ViewColumn()
    FILES_ID: number;

    @ViewColumn()
    PAGE_NUM: number;

    @ViewColumn()
    PAGE_TAG: string;

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
