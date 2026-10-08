import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ATTRNFRM', schema: 'WEBFORM' })
export class ATTRNFRM {
    @PrimaryColumn({ name: 'NFRMNO', type: 'decimal', precision: 3 })
    NFRMNO: number;

    @PrimaryColumn({ name: 'VORGNO', length: 6 })
    VORGNO: string;

    @PrimaryColumn({ name: 'CYEAR', type: 'char', length: 2 })
    CYEAR: string;

    @PrimaryColumn({ name: 'CYEAR2', type: 'char', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ name: 'NRUNNO', type: 'decimal', precision: 7 })
    NRUNNO: number;

    @PrimaryColumn({ name: 'ID', type: 'decimal', precision: 2 })
    ID: number;

    @Column({ name: 'SFILE', length: 70 })
    SFILE: string;

    @Column({ name: 'TYPENO', type: 'char', length: 1, nullable: true })
    TYPENO: string;
}
