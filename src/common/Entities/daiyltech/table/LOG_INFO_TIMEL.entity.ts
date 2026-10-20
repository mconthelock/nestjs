import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { CM_SM_FORM } from './CM_SM_FORM.entity';
import { DTIH } from './DTIH.entity';

@Entity({ name: 'LOG_INFO_TIMEL', schema: 'DAILYTECH' })
export class LOG_INFO_TIMEL {
    @PrimaryColumn()
    TINO: string;

    @PrimaryColumn()
    SECTCODE: string;

    @PrimaryColumn()
    TIMELNO: string;

    @Column()
    TIMELDATE: Date;

    @Column()
    DATERUN: Date;

    @Column()
    STATUS: string;

    @Column()
    INFO_DETAIL: string;

    @ManyToOne(() => DTIH, (dtih) => dtih.LOG_INFO_TIMEL)
    @JoinColumn({ name: 'TINO', referencedColumnName: 'TINO' })
    DTIH: Relation<DTIH>;
}
