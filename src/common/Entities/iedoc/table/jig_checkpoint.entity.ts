import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigMaster } from './jig_master.entity';

@Entity({ name: 'JIG_CHECKPOINT' })
export class JigCheckpoint {
    @PrimaryColumn({ length: 20 })
    JIG_NO: string;

    @PrimaryColumn({ type: 'decimal', precision: 2, scale: 0 })
    CHECK_SEQ: number;

    @Column({ length: 200, nullable: false })
    CHECK_POINT: string;

    @Column({ length: 100, nullable: true })
    INSPECTION_TOOL: string | null;

    @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
    MIN: number | null;

    @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
    MAX: number | null;

    @Column({ length: 20, nullable: true })
    UNIT: string | null;

    @Column({ length: 10, nullable: true })
    CREATE_BY: string | null;

    @Column({ type: 'date', nullable: false, default: () => 'SYSDATE' })
    CREATE_DATE: Date;

    @Column({ length: 10, nullable: true })
    UPDATE_BY: string | null;

    @Column({ type: 'date', nullable: true })
    UPDATE_DATE: Date | null;

    @ManyToOne(() => JigMaster)
    @JoinColumn({ name: 'JIG_NO', referencedColumnName: 'JIG_NO' })
    jig: JigMaster;
}
