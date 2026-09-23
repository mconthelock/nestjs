import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigForm } from './jig_form.entity';

@Entity({ name: 'JIG_FORM_NG' })
export class JigFormNg {
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

    @Column({ type: 'varchar2', length: 500, nullable: false })
    DEFECT_DETAIL: string;

    @Column({ type: 'varchar2', length: 100, nullable: false })
    ACTION: string;

    @Column({ type: 'varchar2', length: 100, nullable: false })
    CORRECTIVE: string;

    @Column({ type: 'date', nullable: false })
    PLAN_DATE: Date;

    @Column({ length: 200, nullable: true })
    LOCATION: string | null;

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
