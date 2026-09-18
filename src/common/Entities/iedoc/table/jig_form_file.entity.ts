import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigForm } from './jig_form.entity';

@Entity({ name: 'JIG_FORM_FILE' })
export class JigFormFile {
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

    @PrimaryColumn({ type: 'decimal', precision: 6, scale: 0 })
    FILE_SEQ: number;

    @Column({ length: 255, nullable: false })
    FILE_NAME: string;

    @Column({ length: 1000, nullable: false })
    FILE_PATH: string;

    @Column({ length: 100, nullable: true })
    FILE_TYPE: string | null;

    @Column({ type: 'decimal', precision: 12, scale: 0, nullable: true })
    FILE_SIZE: number | null;

    @Column({ length: 10, nullable: true })
    CREATE_BY: string | null;

    @Column({ type: 'date', nullable: false, default: () => 'SYSDATE' })
    CREATE_DATE: Date;

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
