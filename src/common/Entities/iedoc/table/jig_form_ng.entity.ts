import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigForm } from './jig_form.entity';

@Entity({ name: 'JIG_FORM_NG' })
export class JigFormNg {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column({ type: 'varchar2', length: 2000 })
    DEFECT_DETAIL: string;

    @Column()
    ACTION: string;

    @Column()
    CORRECTIVE: string;

    @Column()
    PLAN_DATE: Date;

    @Column({ type: 'date', nullable: true })
    ACTUAL_FINNISH_DATE: Date | null;

    @Column({ type: 'varchar2', length: 2000, nullable: true })
    SUMMARY_DETAIL: string | null;

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
