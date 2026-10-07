import { ViewColumn, ViewEntity, PrimaryColumn } from 'typeorm';

@ViewEntity({ name: 'VIEW_WELFARE_DETAIL', schema: 'WEBFORM' })
export class WelfareDetailView {
    @ViewColumn()
    FTYPE: string;

    @ViewColumn()
    FRMNO: string;

    @ViewColumn()
    NFRMNO: string;

    @ViewColumn()
    VORGNO: string;

    @ViewColumn()
    CYEAR: string;

    @ViewColumn()
    CYEAR2: string;

    @ViewColumn()
    NRUNNO: string;

    @ViewColumn()
    CST: string;

    @ViewColumn()
    DREQDATE: Date;

    @ViewColumn()
    VISITDATE: string;

    @ViewColumn()
    SEMPNO_IN: string;

    @ViewColumn()
    SNAME_IN: string;

    @ViewColumn()
    SEMPNO_REQ: string;

    @ViewColumn()
    SNAME_REQ: string;

    @ViewColumn()
    POSITION_REQ: string;

    @ViewColumn()
    PSNIDN: string;

    @ViewColumn()
    SSECCODE: string;

    @ViewColumn()
    SSEC: string;

    @ViewColumn()
    OPDYEAR: string;

    @ViewColumn()
    OPDRIGHT: string;

    @ViewColumn()
    OPDREMAIN: string;

    @ViewColumn()
    OPDADD: string;

    @ViewColumn()
    OPDADD_REMAIN: string;

    @ViewColumn()
    REWARDNO: string;

    @ViewColumn()
    REWARD: string;

    @ViewColumn()
    MAXREWARD: string;

    @ViewColumn()
    HEAD_EN: string;

    @ViewColumn()
    HEAD_TH: string;

    @ViewColumn()
    DISEASE: string;

    @ViewColumn()
    DOCNO: string;

    @ViewColumn()
    DOCDATE: Date;

    @ViewColumn()
    HOSPITAL: string;

    @ViewColumn()
    PAYDATE: Date;

    @ViewColumn()
    MANAGER: string;

    @ViewColumn()
    MANAGER_NAME: string;

    @ViewColumn()
    POSITION: string;

    @ViewColumn()
    UNVISIT: string;

    @ViewColumn()
    REASONID: string;

    @ViewColumn()
    REASONDETAIL: string;

    @ViewColumn()
    PATIENTY: string;

    @ViewColumn()
    DESCRIPTION: string;

    @ViewColumn()
    RELNO: string;

    @ViewColumn()
    RELATION: string;

    @ViewColumn()
    AMOUNTPAID: number;

    @ViewColumn()
    PREFIX: string;

    @ViewColumn()
    FULLNAME: string;

    @ViewColumn()
    NAME: string;

    @ViewColumn()
    RELID: string;

    @ViewColumn()
    STRL: string;

    @ViewColumn()
    NAMEMT: string;
}
