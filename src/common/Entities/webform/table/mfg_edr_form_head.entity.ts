import { Column, Entity, OneToMany, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { MfgEdrFormList } from './mfg_edr_form_list.entity';
import { MfgEdrFormAtt } from './mfg_edr_form_att.entity';
import { EdrCauseMst } from './edr_cause_mst.entity';
import { EdrWorktypeMst } from './edr_worktype_mst.entity';
import { MfgEdrFormCause4m } from './mfg_edr_form_cause4m.entity';

@Entity({ name: 'MFG_EDR_FORM_HEAD' })
export class MfgEdrFormHead {
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
    TID: number | null;

    @Column()
    SSECCODE: string | null;

    @Column()
    CID: number | null;

    @Column()
    REPAIR_BY: string | null;

    @Column()
    DAILY_MONTH: string | null;

    @Column()
    DAILY_RUNNO: number | null;

    @Column()
    REASON_CAUSE: string | null;

    @OneToMany(() => MfgEdrFormList, (list) => list.head)
    list: MfgEdrFormList[];

    @OneToMany(() => MfgEdrFormAtt, (att) => att.head)
    att: MfgEdrFormAtt[];

    @OneToMany(() => MfgEdrFormCause4m, (cause4m) => cause4m.head)
    cause4m: MfgEdrFormCause4m[];

    @ManyToOne(() => EdrCauseMst)
    @JoinColumn({ name: 'CID', referencedColumnName: 'CID' })
    cause: EdrCauseMst | null;

    @ManyToOne(() => EdrWorktypeMst)
    @JoinColumn({ name: 'TID', referencedColumnName: 'TID' })
    worktype: EdrWorktypeMst | null;
}