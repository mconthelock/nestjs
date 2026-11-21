import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PROC_TSATTFILE', schema: 'IEDOC' })
export class PROC_TSATTFILE {
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

    @PrimaryColumn({ precision: 2, scale: 0 })
    ID: number;

    @Column({ length: 200, nullable: true })
    FILENAME: string | null;
}
