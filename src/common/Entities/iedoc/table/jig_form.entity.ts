import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'JIG_FORM' })
export class JigForm {
    @PrimaryColumn({ type: 'decimal', precision: 3, scale: 0 })
    NFRMNO: number;

    @PrimaryColumn({ length: 6 })
    VORGNO: string;

    @PrimaryColumn({ type: 'char', length: 2 })
    CYEAR: string;

    @PrimaryColumn({ type: 'char', length: 4 })
    CYEAR2: string;

    @PrimaryColumn({ type: 'decimal', precision: 6, scale: 0 })
    NRUNNO: number;

    @Column({ type: 'varchar2', length: 20, nullable: false })
    FORM_TYPE: 'CREATE' | 'INSPECTION';

    @Column({ type: 'varchar2', length: 20, nullable: false })
    JIG_NO: string;

    @Column({ type: 'varchar2', length: 200, nullable: false })
    JIG_NAME: string;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    DWG: string | null;

    @Column({ type: 'varchar2', length: 2, nullable: true })
    REV: string | null;

    @Column({ type: 'number', precision: 5, scale: 0, nullable: true })
    JIG_QTY: number | null;

    @Column({ type: 'number', precision: 12, scale: 2, nullable: true })
    PRICE: number | null;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    MAKER: string | null;

    @Column({ type: 'date', nullable: true })
    START_USE_DATE: Date | null;

    @Column({ type: 'varchar2', length: 4, nullable: true })
    ITEMNO: string | null;

    @Column({ type: 'varchar2', length: 200, nullable: true })
    JIG_DESC: string | null;

    @Column({ type: 'varchar2', length: 50, nullable: true })
    PROCESS_CODE: string | null;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    LOCATION: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    PIC_EMPNO: string | null;

    @Column({ type: 'number', precision: 3, scale: 0, nullable: false })
    INSPEC_PERIOD: number;

    @Column({ type: 'varchar2', length: 1000, nullable: true })
    REMARK: string | null;
}
