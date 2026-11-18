import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PROC_TSHEADFORM', schema: 'IEDOC' })
export class PROC_TSHEADFORM {
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

    @Column({ type: 'varchar2', length: 9, nullable: true })
    DWGNO: string | null;

    @Column({ type: 'varchar2', length: 3, nullable: true })
    GNO: string | null;

    @Column({ type: 'varchar2', length: 3, nullable: true })
    LNO: string | null;

    @Column({ type: 'varchar2', length: 2, nullable: true })
    REVISION: string | null;

    @Column({ type: 'varchar2', length: 3, nullable: true })
    ITEMNO: string | null;

    @Column({ type: 'date', nullable: true })
    INPUTDATE: Date | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    EFFJUN: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    IDTAGJUN: string | null;

    @Column({ type: 'varchar2', length: 4000, nullable: true })
    VDETAIL: string | null;

    @Column({ type: 'char', length: 1, nullable: true })
    TSFLAG: string | null;

    @Column({ type: 'varchar2', length: 3, nullable: true })
    LNO2: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    PLANJUN: string | null;

    @Column({ type: 'varchar2', length: 500, nullable: true })
    TSFLAG_DETAIL: string | null;

    @Column({ type: 'varchar2', length: 2, nullable: true })
    PNO: string | null;
}
