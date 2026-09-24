import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigMaster } from './jig_master.entity';

@Entity({ name: 'JIG_DEFECT_NG' })
export class JigDefectNg {
    @PrimaryColumn({ length: 20 })
    JIG_NO: string;
    
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

    @ManyToOne(() => JigMaster)
    @JoinColumn({ name: 'JIG_NO', referencedColumnName: 'JIG_NO' })
    jig: JigMaster;
}
