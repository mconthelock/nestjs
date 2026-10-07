import { Column, Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { LOANFRM } from 'src/common/Entities/webform/table/LOANFRM.entity';

@Entity({ name: 'EMP04', schema: 'GPREPORT' })
export class EMP04 {
    @PrimaryColumn()
    EMPCOD: string;

    @Column()
    EHLTME: number;

    @Column()
    EHLADT: number;

    @PrimaryColumn()
    EHLCNO: string;

    @Column()
    EHLPDT: number;

    @Column()
    EHLLMT: number;

    @Column()
    EHLPPD: number;

    @Column()
    EHLINT: number;

    @Column()
    EHLRMK: string;

    @Column()
    EDDDOC: string;

    @Column()
    EDDDOC01: string;

    @Column()
    EDDDOC02: string;

    @PrimaryColumn()
    GRTCOD: string;

    @Column()
    GRTNMT: string;

    @Column()
    DEPABT: string;

    @Column()
    POSTN: string;

    @Column()
    GRTDTE: number;

    @ManyToOne(() => LOANFRM, (frm) => frm.LOANNO)
    @JoinColumn([{ name: 'EHLCNO', referencedColumnName: 'LOANNO' }])
    form: LOANFRM;
}
