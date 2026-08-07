import { Column, PrimaryColumn } from 'typeorm';

export class Vannplan {
    @PrimaryColumn()
    PRODUCTION: string;

    @PrimaryColumn()
    ORDERNO: string;

    @Column()
    SELECTION: string;

    @Column()
    ORDERTYPE: number;

    @Column()
    URGENTLY: number;

    @Column()
    MFG_QC_PLAN: string;

    @Column()
    POSTPONEVAN: string;

    @Column()
    MASTERCY: string;

    @Column()
    VANNDATE: string;

    @Column()
    POSTPONEREM: string;

    @Column()
    REMARK: string;

    @Column()
    PROJECT: string;

    @Column()
    MODEL: string;

    @Column()
    P: string;

    @Column()
    MARCOMPLETESET: string;

    @Column()
    MARIMPORTANT: string;

    @Column()
    WHDATA: string;

    @Column()
    ISSUEPL: string;

    @Column()
    ACTUALPL: string;

    @Column()
    CONFIRMDATE: string;

    @Column()
    SHIPBAL: string;

    @Column()
    ACLVAN: string;

    @Column()
    VANNSTATUS: number;

    @Column()
    USERUPDATE: string;

    @Column()
    LASTUPDATE: Date;

    @Column()
    MARKCOLOR: number;

    @Column()
    MELTPLAN: number;

    @Column()
    LASTUPDATEVANNDATE: Date;

    @Column()
    MOVETOMELTACT: string;

    @Column()
    MASTERVANNINGPLAN: string;
}
