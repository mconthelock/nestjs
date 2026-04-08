import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, ViewColumn, ViewEntity } from 'typeorm';
import { ORGPOS } from '../../webform/table/ORGPOS.entity';
import { QAINS_FORM } from '../../webform/table/QAINS_FORM.entity';
import { QAINS_OPERATOR_AUDITOR } from '../../webform/table/QAINS_OPERATOR_AUDITOR.entity';
import { USERS } from '../../escs/table/USERS.entity';

@Entity({ name: 'AMECUSERALL', schema: 'AMEC' })
export class AMECUSERALL {
    @PrimaryColumn()
    SEMPNO: string;

    @Column()
    PSNIDN: string;

    @Column()
    SEMPPRE: string;

    @Column()
    SNAME: string;

    @Column()
    SEMPPRT: string;

    @Column()
    BIRTHDAY: number;

    @Column()
    STNAME: string;

    @Column()
    SSECCODE: string;

    @Column()
    SSEC: string;

    @Column()
    SDEPCODE: string;

    @Column()
    SDEPT: string;

    @Column()
    SDIVCODE: string;

    @Column()
    SDIV: string;

    @Column()
    SRECMAIL: string;

    @Column()
    MEMEML: string;

    @Column()
    MELGIT: string;

    @Column()
    SPOSCODE: string;

    @Column()
    SPOSITION: string;

    @Column()
    SPOSNAME: string;

    @Column()
    CLEVEL: string;

    @Column()
    STARTDATE: Date;

    @Column()
    CSTATUS: string;

    @Column()
    SPASSWORD1: string;

    @Column()
    NTELNO: number;

    @Column()
    JOBTYPE: string;

    @Column()
    SEMPENCODE: string;

    @Column()
    EMPSEX: string;

    @OneToOne(() => ORGPOS, (o) => o.EMPINFO)
    @JoinColumn({ name: 'SEMPNO', referencedColumnName: 'VEMPNO' })
    ORGPOS: ORGPOS;

    @OneToOne(() => QAINS_FORM, (q) => q.QA_INCHARGE_INFO)
    QAINCHARGE: QAINS_FORM;

    @OneToOne(() => QAINS_OPERATOR_AUDITOR, (q) => q.QOA_EMPNO_INFO)
    QAINSOA: QAINS_OPERATOR_AUDITOR;

    @OneToOne(() => USERS, (escsUser) => escsUser.user)
    escsUser: USERS;
}
