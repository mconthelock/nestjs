import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PROC_TSDETFORM', schema: 'IEDOC' })
export class PROC_TSDETFORM {
    @PrimaryColumn({ type: 'number', precision: 4, scale: 0 })
    NFRMNO: number;

    @PrimaryColumn({ type: 'varchar2', length: 6 })
    VORGNO: string;

    @PrimaryColumn({ type: 'char', length: 2 })
    CYEAR: string;

    @PrimaryColumn({ type: 'char', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ type: 'number', precision: 6, scale: 0 })
    NRUNNO: number;

    @PrimaryColumn({ type: 'varchar2', length: 3 })
    SEQ: string;

    @PrimaryColumn({ type: 'varchar2', length: 6 })
    PROCID: string;

    @Column({ type: 'varchar2', length: 6 })
    PROCID_OLD: string;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    TP_OLD: string | null;

    @Column({ type: 'varchar2', length: 6, nullable: true })
    TC_OLD: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    TP: string | null;

    @Column({ type: 'varchar2', length: 6, nullable: true })
    TC: string | null;

    @Column({ type: 'varchar2', length: 2, nullable: true })
    SEQ_PROC: string | null;

    @Column({ type: 'varchar2', length: 9, nullable: true })
    DWG: string | null;

    @Column({ type: 'varchar2', length: 3, nullable: true })
    GNO: string | null;

    @Column({ type: 'varchar2', length: 7, nullable: true })
    LNO: string | null;
}
