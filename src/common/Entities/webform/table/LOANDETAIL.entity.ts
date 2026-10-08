import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { LOANFRM } from './LOANFRM.entity';

@Entity({ name: 'LOANDETAIL', schema: 'WEBFORM' })
export class LOANDETAIL {
    @PrimaryColumn()
    LOANNO: string;

    @Column()
    STATUSB: string;

    @Column()
    STATUSA: string;

    @Column()
    REMARK: string;

    @OneToOne(() => LOANFRM, (loanDetail) => loanDetail.LOANNO)
    @JoinColumn([{ name: 'LOANNO', referencedColumnName: 'LOANNO' }])
    detail: LOANFRM;
}
