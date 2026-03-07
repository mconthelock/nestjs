import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'AMECUUSERALL', schema: 'AMEC' })
export class AMECUUSERALL {
    @ViewColumn()
    SEMPNO: string;

    @ViewColumn()
    PSNIDN: string;

    @ViewColumn()
    SEMPPRE: string;

    @ViewColumn()
    SNAME: string;

    @ViewColumn()
    SEMPPRT: string;

    @ViewColumn()
    BIRTHDAY: number;

    @ViewColumn()
    STNAME: string;

    @ViewColumn()
    SSECCODE: string;

    @ViewColumn()
    SSEC: string;

    @ViewColumn()
    SDEPCODE: string;

    @ViewColumn()
    SDEPT: string;

    @ViewColumn()
    SDIVCODE: string;

    @ViewColumn()
    SDIV: string;

    @ViewColumn()
    SRECMAIL: string;

    @ViewColumn()
    MEMEML: string;

    @ViewColumn()
    MELGIT: string;

    @ViewColumn()
    SPOSCODE: string;

    @ViewColumn()
    SPOSITION: string;

    @ViewColumn()
    SPOSNAME: string;

    @ViewColumn()
    CLEVEL: string;

    @ViewColumn()
    STARTDATE: Date;

    @ViewColumn()
    CSTATUS: string;

    @ViewColumn()
    SPASSWORD1: string;

    @ViewColumn()
    NTELNO: number;

    @ViewColumn()
    JOBTYPE: string;

    @ViewColumn()
    SEMPENCODE: string;

    @ViewColumn()
    EMPSEX: string;
}
