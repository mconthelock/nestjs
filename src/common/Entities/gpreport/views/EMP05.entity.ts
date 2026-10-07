import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { LOANFRM } from 'src/common/Entities/webform/table/LOANFRM.entity';
@Entity({ name: 'EMP05', schema: 'GPREPORT' })
export class EMP05 {
    @PrimaryColumn()
    EMPCOD: string;

    @PrimaryColumn()
    EHLCNO: string;

    @PrimaryColumn()
    EDLTRM: number;

    @Column()
    EDLPRD: number;

    @Column()
    EDLPDT: number;

    @Column()
    EDLPMT: number;

    @Column()
    EDLINT: number;

    @Column()
    EDLSTS: string;

    @ManyToOne(() => LOANFRM, (frm) => frm.LOANNO)
    @JoinColumn([{ name: 'EHLCNO', referencedColumnName: 'LOANNO' }])
    form: LOANFRM;
}
