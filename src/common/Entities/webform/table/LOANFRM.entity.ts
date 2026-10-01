import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { LOANDETAIL } from './LOANDETAIL.entity';

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

    @OneToMany(() => LOANDETAIL, (loanDetail) => loanDetail.LOANNO)
    detail: LOANDETAIL[];
}
