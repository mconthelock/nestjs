import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';

import { FORM } from './FORM.entity';
import { LOANDETAIL } from './LOANDETAIL.entity';
import { EMP04 } from '../../gpreport/views/EMP04.entity';
import { EMP05 } from '../../gpreport/views/EMP05.entity';

@Entity({ name: 'LOANFRM', schema: 'WEBFORM' })
export class LOANFRM {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    LOANNO: string;

    @Column()
    LOANAMT: number;

    @Column()
    LID_PUR: number;

    @Column()
    DUEDATE: Date;

    @Column()
    DETAIL: string;

    @Column()
    PAYDATE: Date;

    @OneToOne(() => FORM)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: FORM;

    @OneToOne(() => LOANDETAIL, (loanDetail) => loanDetail.LOANNO)
    @JoinColumn([{ name: 'LOANNO', referencedColumnName: 'LOANNO' }])
    detail: LOANDETAIL[];

    @OneToMany(() => EMP04, (emp04) => emp04.form)
    @JoinColumn([{ name: 'LOANNO', referencedColumnName: 'EHLCNO' }])
    guarantor: EMP04[];

    @OneToMany(() => EMP05, (emp05) => emp05.form)
    @JoinColumn([{ name: 'LOANNO', referencedColumnName: 'EHLCNO' }])
    paid: EMP05[];
}
