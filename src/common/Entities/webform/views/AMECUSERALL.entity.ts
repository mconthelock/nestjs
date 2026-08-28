import {
    ViewEntity,
    PrimaryColumn,
    ViewColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';

@ViewEntity({
    name: 'AMECUSERALL',
    schema: 'WEBFORM',
})
export class User {
    @PrimaryColumn()
    SEMPNO: string;

    @ViewColumn()
    SEMPPRE: string;

    @ViewColumn()
    SNAME: string;

    @ViewColumn()
    SRECMAIL: string;

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
    SPOSCODE: string;

    @ViewColumn()
    SPOSNAME: string;

    @ViewColumn()
    SPOSITION: string;

    @ViewColumn()
    SPASSWORD1: string;

    @ViewColumn()
    CSTATUS: string;

    @ViewColumn()
    SEMPENCODE: string;

    @ViewColumn()
    MEMEML: string;

    @ViewColumn()
    SEMPPRT: string;

    @ViewColumn()
    STNAME: string;

    @ViewColumn()
    STARTDATE: Date;

    @ViewColumn()
    NTELNO: number;
}
