import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigMaster } from './jig_master.entity';

@Entity({ name: 'JIG_FORM' })
export class JigForm {
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

    @Column({ type: 'varchar2', length: 20, nullable: true })
    JIG_NO: string | null;

    @Column({ type: 'varchar2', length: 20, nullable: false })
    FORM_TYPE: string;

    @Column({ type: 'date', nullable: true })
    SCHEDULE_DATE: Date | null;

    @Column({ type: 'date', nullable: true })
    CHECK_DATE: Date | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    INSPECTOR_EMPNO: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    OVERALL_RESULT: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    CREATE_BY: string | null;

    @Column({ type: 'date', nullable: false, default: () => 'SYSDATE' })
    CREATE_DATE: Date;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    UPDATE_BY: string | null;

    @Column({ type: 'date', nullable: true })
    UPDATE_DATE: Date | null;

    @ManyToOne(() => JigMaster)
    @JoinColumn({ name: 'JIG_NO', referencedColumnName: 'JIG_NO' })
    jig: JigMaster;
}
