import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'VANNPLAN', schema: 'WORKLOAD' })
export class Vannplan {
    @ViewColumn()
    PRODUCTION: string;

    @ViewColumn()
    ORDERNO: string;

    @ViewColumn()
    SELECTION: string;

    @ViewColumn()
    ORDERTYPE: number;

    @ViewColumn()
    URGENTLY: number;

    @ViewColumn()
    MFG_QC_PLAN: string;

    @ViewColumn()
    POSTPONEVAN: string;

    @ViewColumn()
    MASTERCY: string;

    @ViewColumn()
    VANNDATE: string;

    @ViewColumn()
    POSTPONEREM: string;

    @ViewColumn()
    REMARK: string;

    @ViewColumn()
    PROJECT: string;

    @ViewColumn()
    MODEL: string;

    @ViewColumn()
    P: string;

    @ViewColumn()
    MARCOMPLETESET: string;

    @ViewColumn()
    MARIMPORTANT: string;

    @ViewColumn()
    WHDATA: string;

    @ViewColumn()
    ISSUEPL: string;

    @ViewColumn()
    ACTUALPL: string;

    @ViewColumn()
    CONFIRMDATE: string;

    @ViewColumn()
    SHIPBAL: string;

    @ViewColumn()
    ACLVAN: string;

    @ViewColumn()
    VANNSTATUS: number;

    @ViewColumn()
    USERUPDATE: string;

    @ViewColumn()
    LASTUPDATE: Date;

    @ViewColumn()
    MARKCOLOR: number;

    @ViewColumn()
    MELTPLAN: number;

    @ViewColumn()
    LASTUPDATEVANNDATE: Date;

    @ViewColumn()
    MOVETOMELTACT: string;

    @ViewColumn()
    MASTERVANNINGPLAN: string;
}
