import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { JigMaster } from './jig_master.entity';

@Entity({ name: 'JIG_INSPECTION' })
export class JigInspection {
    @PrimaryColumn()
    INSPEC_ID: number;

    @Column()
    JIG_NO: string;

    @Column()
    SCHEDULE_DATE: Date;

    @Column()
    INSPEC_DATE: Date | null;

    @Column()
    INSPEC_STATUS: string;

    @Column()
    CREATE_DATE: Date;

    @Column()
    UPDATE_DATE: Date | null;

    @ManyToOne(() => JigMaster, (jig) => jig.inspections)
    @JoinColumn({ name: 'JIG_NO' })
    jig: JigMaster;
}