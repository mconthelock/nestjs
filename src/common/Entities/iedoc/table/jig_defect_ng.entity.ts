import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JigMaster } from './jig_master.entity';

@Entity({ name: 'JIG_DEFECT_NG' })
export class JigDefectNg {
    @PrimaryColumn()
    JIG_NO: string;
    
    @Column()
    DEFECT_DETAIL: string;

    @Column()
    ACTION: string;

    @Column()
    CORRECTIVE: string;

    @Column()
    PLAN_DATE: Date;

    @Column()
    LOCATION: string | null;

    @ManyToOne(() => JigMaster)
    @JoinColumn({ name: 'JIG_NO', referencedColumnName: 'JIG_NO' })
    jig: JigMaster;
}
