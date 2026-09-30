import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigForm } from './jig_form.entity';

@Entity({ name: 'JIG_FORM_DETAIL' })
export class JigFormDetail {
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

    @PrimaryColumn()
    CHECK_SEQ: number;

    @Column()
    CHECK_POINT: string;

    @Column()
    INSPECTION_TOOL: string | null;

    @Column()
    MIN: number | null;

    @Column()
    MAX: number | null;

    @Column()
    MEASURED_VALUE: number | null;

    @Column()
    UNIT: string | null;

    @Column()
    RESULT: string | null;

    @ManyToOne(() => JigForm, { createForeignKeyConstraints: false })
    @JoinColumn([
        { name: 'NFRMNO', referencedColumnName: 'NFRMNO' },
        { name: 'VORGNO', referencedColumnName: 'VORGNO' },
        { name: 'CYEAR', referencedColumnName: 'CYEAR' },
        { name: 'CYEAR2', referencedColumnName: 'CYEAR2' },
        { name: 'NRUNNO', referencedColumnName: 'NRUNNO' },
    ])
    form: JigForm;
}
