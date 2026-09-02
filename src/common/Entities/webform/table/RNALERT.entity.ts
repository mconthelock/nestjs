import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'RNALERT', schema: 'WEBFORM' })
export class RNALERT {
    @PrimaryColumn({ name: 'NFRMNO', type: 'number', precision: 3 })
    NFRMNO: number;

    @PrimaryColumn({ name: 'VORGNO', type: 'varchar2', length: 6 })
    VORGNO: string;

    @PrimaryColumn({ name: 'CYEAR', type: 'char', length: 2 })
    CYEAR: string;

    @PrimaryColumn({ name: 'CYEAR2', type: 'char', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ name: 'NRUNNO', type: 'number', precision: 7 })
    NRUNNO: number;

    @Column({ name: 'SEMREQ', type: 'date', nullable: true })
    SEMREQ: Date;

    @Column({ name: 'DEMPIC', type: 'date', nullable: true })
    DEMPIC: Date;

    @Column({ name: 'DEMREQ', type: 'date', nullable: true })
    DEMREQ: Date;
}