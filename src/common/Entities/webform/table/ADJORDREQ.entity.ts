import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ADJREASONMST } from './ADJREASONMST.entity';

@Entity({ name: 'ADJORDREQ', schema: 'WEBFORM' })
export class ADJORDREQ {
    @PrimaryColumn({ type: 'number', precision: 3, scale: 0 })
    NFRMNO: number;

    @PrimaryColumn({ type: 'varchar2', length: 6 })
    VORGNO: string;

    @PrimaryColumn({ type: 'char', length: 2 })
    CYEAR: string;

    @PrimaryColumn({ type: 'char', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ type: 'number', precision: 6, scale: 0 })
    NRUNNO: number;

    @PrimaryColumn({ type: 'varchar2', length: 11 })
    CNTLNO: string;

    @Column({ type: 'varchar2', length: 9, nullable: true })
    ORDERNO: string | null;

    @Column({ type: 'varchar2', length: 6, nullable: true })
    PROCID: string | null;

    @Column({ type: 'varchar2', length: 6, nullable: true })
    QTY: string | null;

    @Column({ type: 'varchar2', length: 17, nullable: true })
    DWGNO: string | null;

    @Column({ type: 'varchar2', length: 16, nullable: true })
    DWGDESC: string | null;

    @Column({ type: 'varchar2', length: 7, nullable: true })
    JUN: string | null;

    @Column({ type: 'varchar2', length: 15, nullable: true })
    STOCKCODE: string | null;

    @Column({ type: 'number', precision: 8, scale: 0, nullable: true })
    PRNO: number | null;

    @Column({ type: 'number', precision: 8, scale: 0, nullable: true })
    LINENO: number | null;

    @Column({ type: 'number', precision: 5, scale: 0, nullable: true })
    VENDNO: number | null;

    @Column({ type: 'varchar2', length: 6, nullable: true })
    REVQTY: string | null;

    @Column({ type: 'char', length: 1, nullable: true })
    REASONNO: string | null;

    @Column({ type: 'varchar2', length: 225, nullable: true })
    DESCRIBE: string | null;

    @ManyToOne(() => ADJREASONMST, { nullable: true })
    @JoinColumn({ name: 'REASONNO', referencedColumnName: 'REASONNO' })
    reason: ADJREASONMST;
}
