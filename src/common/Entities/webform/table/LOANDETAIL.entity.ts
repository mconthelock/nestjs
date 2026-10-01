import { Column, Entity, PrimaryColumn } from 'typeorm';

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
}
