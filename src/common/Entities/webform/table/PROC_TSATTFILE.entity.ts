import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PROC_TSATTFILE', schema: 'IEDOC' })
export class PROC_TSATTFILE {
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

    @PrimaryColumn({ type: 'number', precision: 2, scale: 0 })
    ID: number;

    @Column({ type: 'varchar2', length: 200, nullable: true })
    FILENAME: string | null;
}
