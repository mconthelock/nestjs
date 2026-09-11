import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigForm } from './jig_form.entity';

@Entity({ name: 'JIG_FORM_FILE' })
export class JigFormFile {
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

    @PrimaryColumn({ type: 'number', precision: 6, scale: 0 })
    FILE_SEQ: number;

    @Column({ type: 'varchar2', length: 255, nullable: false })
    FILE_NAME: string;

    @Column({ type: 'varchar2', length: 1000, nullable: false })
    FILE_PATH: string;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    FILE_TYPE: string | null;

    @Column({ type: 'number', precision: 12, scale: 0, nullable: true })
    FILE_SIZE: number | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
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
