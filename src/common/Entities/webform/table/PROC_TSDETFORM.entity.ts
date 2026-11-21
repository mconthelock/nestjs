import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PROC_TSDETFORM', schema: 'IEDOC' })
export class PROC_TSDETFORM {
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

    @PrimaryColumn({ length: 6 })
    PROCID: string;

    @Column({ length: 6 })
    PROCID_OLD: string;

    @Column({ length: 8, nullable: true })
    TP_OLD: string | null;

    @Column({ length: 8, nullable: true })
    TC_OLD: string | null;

    @Column({ length: 8, nullable: true })
    TP: string | null;

    @Column({ length: 8, nullable: true })
    TC: string | null;

    @Column({ length: 2, nullable: true })
    SEQ_PROC: string | null;

    @Column({ length: 9, nullable: true })
    DWG: string | null;

    @Column({ length: 3, nullable: true })
    GNO: string | null;

    @Column({ length: 7, nullable: true })
    LNO: string | null;
}
