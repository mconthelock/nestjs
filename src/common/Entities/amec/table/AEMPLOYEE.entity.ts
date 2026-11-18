import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'AEMPLOYEE', schema: 'AMEC' })
export class AEmployee {
    @PrimaryColumn()
    SEMPNO: string;

    @Column()
    SDIVCODE: string;

    @Column()
    SDEPCODE: string;

    @Column()
    SSECCODE: string;

    @Column()
    SPOSCODE: string;

    @Column()
    SNAME: string;

    @Column()
    SSURNAME: string;

    @Column()
    STNAME: string;

    @Column()
    STSURNAME: string;

    @Column()
    SLOGIN: string;

    @Column()
    SPASSWORD: string;

    @Column()
    CSTATUS: string;

    @Column()
    CRECMAIL: string;

    @Column()
    SRECMAIL: string;

    @Column()
    STARTDATE: Date;

    @Column()
    CLEVEL: string;

    @Column()
    NTELNO: number;

    @Column()
    NISMSTATUS: number;

    @Column()
    DUPDATE: Date;

    @Column()
    SPASSWORD1: string;

    @Column()
    SPASSWORD2: string;

    @Column()
    SPASSWORD3: string;

    @Column()
    RESIGNDATE: Date;

    @Column()
    JOBTYPE: string;

    @Column()
    CREUSRDATE: Date;

    @Column()
    UPDUSRDATE: Date;

    @Column()
    VPSNID: string;

    @Column()
    MELGIT: string;
}
