import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigForm } from './jig_form.entity';

@Entity({ name: 'JIG_FORM_DETAIL' })
export class JigFormDetail {
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
    CHECK_SEQ: number;

    @Column({ type: 'varchar2', length: 200, nullable: false })
    CHECK_POINT: string;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    INSPECTION_TOOL: string | null;

    @Column({ type: 'number', precision: 12, scale: 4, nullable: true })
    MIN: number | null;

    @Column({ type: 'number', precision: 12, scale: 4, nullable: true })
    MAX: number | null;

    @Column({ type: 'number', precision: 12, scale: 4, nullable: true })
    MEASURED_VALUE: number | null;

    @Column({ type: 'varchar2', length: 20, nullable: true })
    UNIT: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    RESULT: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    UPDATE_BY: string | null;

    @Column({ type: 'date', nullable: true })
    UPDATE_DATE: Date | null;

    @ManyToOne(() => JigForm)
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: JigForm;
}
