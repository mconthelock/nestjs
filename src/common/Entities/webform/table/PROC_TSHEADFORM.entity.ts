import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PROC_TSHEADFORM', schema: 'IEDOC' })
export class PROC_TSHEADFORM {
    @PrimaryColumn({ precision: 4, scale: 0 })
    NFRMNO: number;

    @PrimaryColumn({ length: 6 })
    VORGNO: string;

    @PrimaryColumn({ type: 'char', length: 2 })
    CYEAR: string;

    @PrimaryColumn({ type: 'char', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ precision: 6, scale: 0 })
    NRUNNO: number;

    @PrimaryColumn({ length: 3 })
    SEQ: string;

    @Column({ length: 9, nullable: true })
    DWGNO: string | null;

    @Column({ length: 3, nullable: true })
    GNO: string | null;

    @Column({ length: 3, nullable: true })
    LNO: string | null;

    @Column({ length: 2, nullable: true })
    REVISION: string | null;

    @Column({ length: 3, nullable: true })
    ITEMNO: string | null;

    @Column({ type: 'date', nullable: true })
    INPUTDATE: Date | null;

    @Column({ length: 5, nullable: true })
    EFFJUN: string | null;

    @Column({ length: 5, nullable: true })
    IDTAGJUN: string | null;

    @Column({ length: 4000, nullable: true })
    VDETAIL: string | null;

    @Column({ type: 'char', length: 1, nullable: true })
    TSFLAG: string | null;

    @Column({ length: 3, nullable: true })
    LNO2: string | null;

    @Column({ length: 5, nullable: true })
    PLANJUN: string | null;

    @Column({ length: 500, nullable: true })
    TSFLAG_DETAIL: string | null;

    @Column({ length: 2, nullable: true })
    PNO: string | null;
}
