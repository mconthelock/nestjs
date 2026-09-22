import { ViewColumn, ViewEntity, PrimaryColumn } from 'typeorm';

@ViewEntity({ name: 'VIEW_WELFARE_FORM', schema: 'WEBFORM' })
export class WelfareFormView {
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
    DISEASE: string;

    @ViewColumn()
    DOCDATE: string;

    @ViewColumn()
    AMOUNTPAID: string;

    @ViewColumn()
    PATIENTY: string;

    @ViewColumn()
    RELNO: string;

    @ViewColumn()
    RELID: string;

    @ViewColumn()
    HOSPITAL: string;

    @ViewColumn()
    PAYDATE: string;

    @ViewColumn()
    MANAGER: string;

    @ViewColumn()
    REWARDNO: string;

    @ViewColumn()
    COVIDTYPE: string;

    @ViewColumn()
    DOCNO: string;

    @ViewColumn()
    RECEIVEFILE: string;

    @ViewColumn()
    UNVISIT: string;

    @ViewColumn()
    REASONID: string;

    @ViewColumn()
    REASONDETAIL: string;

    @ViewColumn()
    SEMPNO: string;

    @ViewColumn()
    VINPUTER: string;

    @ViewColumn()
    CST: string;

    @ViewColumn()
    DREQDATE: string;

    @ViewColumn()
    VISITDATE: string;

    @ViewColumn()
    FYEAR: string;
}
