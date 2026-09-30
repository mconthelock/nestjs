import { Column, Entity, PrimaryColumn } from 'typeorm';

// The five-key foreign key to WEBFORM.FORM is managed by the database.
@Entity({ name: 'JIGDEL_FORM' })
export class JigDelForm {
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
    @Column({ type: 'varchar2', length: 20 })
    JIG_NO: string;
    @Column({ type: 'varchar2', length: 1000, nullable: true })
    REASON: string | null;
    @Column({ type: 'varchar2', length: 1000, nullable: true })
    DETAIL: string | null;
}
