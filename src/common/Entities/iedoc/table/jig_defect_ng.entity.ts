import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigMaster } from './jig_master.entity';

@Entity({ name: 'JIG_DEFECT_NG' })
export class JigDefectNg {
    @PrimaryColumn()
    JIG_NO: string;
    
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

    @ManyToOne(() => JigMaster)
    @JoinColumn({ name: 'JIG_NO', referencedColumnName: 'JIG_NO' })
    jig: JigMaster;
}
