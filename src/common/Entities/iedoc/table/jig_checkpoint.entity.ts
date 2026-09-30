import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigMaster } from './jig_master.entity';

@Entity({ name: 'JIG_CHECKPOINT' })
export class JigCheckpoint {
    @PrimaryColumn({ length: 20 })
    JIG_NO: string;

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
    UNIT: string | null;

    @Column()
    MEASURED_VALUE: number | null;

    @ManyToOne(() => JigMaster)
    @JoinColumn({ name: 'JIG_NO', referencedColumnName: 'JIG_NO' })
    jig: JigMaster;
}
