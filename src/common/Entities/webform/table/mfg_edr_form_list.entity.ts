import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { MfgEdrFormHead } from './mfg_edr_form_head.entity';
import { EdrProcessMst } from './edr_process_mst.entity';
import { EdrLineMst } from './edr_line_mst.entity';

@Entity({ name: 'MFG_EDR_FORM_LIST' })
export class MfgEdrFormList {
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

    @PrimaryColumn()
    ID: number;

    @Column()
    ORDERNO: string | null;

    @Column()
    DWGNO: string | null;

    @Column()
    ITEM: string | null;

    @Column()
    QTY: number | null;

    @Column()
    DETAIL: string | null;

    @Column()
    LV_EFFECT: string | null;

    @Column()
    EFFECT: string | null;

    @Column()
    LID: number | null;

    @Column()
    PID: number | null;

    @Column()
    LOT: string | null;

    @Column()
    SERIAL: string | null;

    @Column()
    PRDN_JUN: string | null;

    @ManyToOne(() => MfgEdrFormHead, (head) => head.list)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    head: MfgEdrFormHead;

    @ManyToOne(() => EdrLineMst)
    @JoinColumn({ name: 'LID', referencedColumnName: 'LID' })
    line: EdrLineMst | null;

    @ManyToOne(() => EdrProcessMst)
    @JoinColumn({ name: 'PID', referencedColumnName: 'PID' })
    process: EdrProcessMst | null;
}