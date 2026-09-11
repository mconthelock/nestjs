import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'JIG_MASTER' })
export class JigMaster {
    @PrimaryColumn({ type: 'varchar2', length: 20 })
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

    @Column({ type: 'varchar2', length: 50, nullable: true })
    ITEMNO: string | null;

    @Column({ type: 'varchar2', length: 200, nullable: true })
    PARTS: string | null;

    @Column({ type: 'varchar2', length: 50, nullable: true })
    PROCESS_CODE: string | null;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    LOCATION: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    PIC_EMPNO: string | null;

    @Column({ type: 'number', precision: 3, scale: 0, nullable: false })
    INSPEC_PERIOD: number;

    @Column({ type: 'date', nullable: true })
    NEXT_INSPEC_DATE: Date | null;

    @Column({ type: 'varchar2', length: 20, nullable: true, default: 'DRAFT' })
    JIG_STATUS: string | null;

    @Column({ type: 'varchar2', length: 1000, nullable: true })
    REMARK: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    CREATE_BY: string | null;

    @Column({ type: 'date', nullable: false, default: () => 'SYSDATE' })
    CREATE_DATE: Date;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    UPDATE_BY: string | null;

    @Column({ type: 'date', nullable: true })
    UPDATE_DATE: Date | null;
}
