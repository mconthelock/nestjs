import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ADJREASONMST } from './ADJREASONMST.entity';

@Entity({ name: 'ADJORDREQ', schema: 'WEBFORM' })
export class ADJORDREQ {
    @PrimaryColumn({ precision: 3, scale: 0 })
    NFRMNO: number;

    @PrimaryColumn({ length: 6 })
    VORGNO: string;

    @PrimaryColumn({ type: 'char', length: 2 })
    CYEAR: string;

    @PrimaryColumn({ type: 'char', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ precision: 6, scale: 0 })
    NRUNNO: number;

    @PrimaryColumn({ length: 11 })
    CNTLNO: string;

    @Column({ length: 9, nullable: true })
    ORDERNO: string | null;

    @Column({ length: 6, nullable: true })
    PROCID: string | null;

    @Column({ length: 6, nullable: true })
    QTY: string | null;

    @Column({ length: 17, nullable: true })
    DWGNO: string | null;

    @Column({ length: 16, nullable: true })
    DWGDESC: string | null;

    @Column({ length: 7, nullable: true })
    JUN: string | null;

    @Column({ length: 15, nullable: true })
    STOCKCODE: string | null;

    @Column({ precision: 8, scale: 0, nullable: true })
    PRNO: number | null;

    @Column({ precision: 8, scale: 0, nullable: true })
    LINENO: number | null;

    @Column({ precision: 5, scale: 0, nullable: true })
    VENDNO: number | null;

    @Column({ length: 6, nullable: true })
    REVQTY: string | null;

    @Column({ type: 'char', length: 1, nullable: true })
    REASONNO: string | null;

    @Column({ length: 225, nullable: true })
    DESCRIBE: string | null;

    @ManyToOne(() => ADJREASONMST, { nullable: true })
    @JoinColumn({ name: 'REASONNO', referencedColumnName: 'REASONNO' })
    reason: ADJREASONMST;
}
