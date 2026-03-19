import { Column, PrimaryColumn } from 'typeorm';

export class M12023_ITEMARRNGLST_APP {
    @PrimaryColumn()
    ORDERNO: string;

    @PrimaryColumn()
    MELCALACLS: string;

    @PrimaryColumn()
    ITEMNO: string;

    @PrimaryColumn()
    SERIALNO: string;

    @Column()
    ICHRGCHKMRK: string;

    @Column()
    SUPCHKMRK: string;

    @Column()
    REVCDBSCSPEC: string;

    @Column()
    REVCDADDSPEC: string;

    @Column()
    REVCDADDSPEC2: string;

    @Column()
    REVCDFINSPEC: string;

    @Column()
    MELCABSRTKEY: string;

    @Column()
    MODELCLS: string;

    @Column()
    FMLTMPCLS: string;

    @Column()
    EXSTNOTE: string;

    @Column()
    DSGELENO: string;

    @Column()
    REGYMDHMS: Date;

    @Column()
    UPYMDHMS: Date;

    @Column()
    ITEMC: string;

    @Column()
    BMCLS: string;

    @Column()
    APNAMERMRK: string;

    @Column()
    PARTNO: string;

    @Column()
    DRAWRANK: string;

    @Column()
    TOTALQTY: string;

    @Column()
    SCNDPRTCLS: string;

    @Column()
    SUPPLYCLS: string;

    @Column()
    UNIT: string;

    @Column()
    EGCLS: string;

    @Column()
    FINPNTCLS: string;

    @Column()
    STDBLK: string;

    @Column()
    SCHDLBLK: string;

    @Column()
    DIVCLS: string;

    @Column()
    BMEXTDONEMK: string;

    @Column()
    ITMSPLYPRCLS: string;

    @Column()
    COMPDT: string;

    @Column()
    IDLOUTCTRLCLS: string;

    @Column()
    MSTRFILECLS: string;

    @Column()
    MSTRRUNNO: string;

    @Column()
    COLLITEM: string;

    @Column()
    SUPSECPSKEY: string;

    @Column()
    REVSUBNO: string;

    @Column()
    REVYMD: Date;

    @Column()
    CHANGECLS: string;

    @Column()
    APPLILOCK: string;
}
