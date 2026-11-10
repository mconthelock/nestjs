import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, Relation } from 'typeorm';
import { DTIH } from './DTIH.entity';
import { LOG_INFO_TIMEL } from './LOG_INFO_TIMEL.entity';

@Entity({ name: 'CM_SM_FORM', schema: 'DAILYTECH' })
export class CM_SM_FORM {
    @PrimaryColumn()
    TINO: string;

    @PrimaryColumn()
    REVNO: string;

    @OneToOne(() => DTIH, (dtih) => dtih.CM_SM_FORM)
    @JoinColumn([
        { name: 'TINO', referencedColumnName: 'TINO' },
        { name: 'REVNO', referencedColumnName: 'REVNO' },
    ])
    DTIH: Relation<DTIH>;

    @Column()
    PRIORITY: string;

    @Column()
    REQUEST_DEADLINE: Date;

    @Column()
    SE_RECEIVE_DATE: Date;

    @Column()
    SE_PIC: string;

    @Column()
    PENDING_SE: string;

    @Column()
    PENDING_JV: string;

    @Column()
    PENDING_EME: string;

    @Column()
    PENDING_EEL: string;

    @Column()
    PENDING_EAS: string;

    @Column()
    PENDING_JV_DATE: Date;

    @Column()
    JV_REPLY_DATE: Date;

    @Column()
    INFORMATION_BETWEEN_DES: string;

    @Column()
    EME_PIC: string;

    @Column()
    EME_CLASS: string;

    @Column()
    EME_REMARK_SPEC: string;

    @Column()
    EME_MELINA_NO: string;

    @Column()
    EME_ISSUE_MELINA_DATE: Date;

    @Column()
    EME_MELINA_PLAN: Date;

    @Column()
    EME_MELINA_FINISH_DATE: Date;

    @Column()
    EME_FINISH_PLAN: Date;

    @Column()
    EME_FINISH_DATE: Date;

    @Column()
    EME_CONFIRMATION: string;

    @Column()
    EME_CONFIRMATION_DATE: Date;

    @Column()
    EEL_PIC: string;

    @Column()
    EEL_CLASS: string;

    @Column()
    EEL_REMARK_SPEC: string;

    @Column()
    EEL_MELINA_NO: string;

    @Column()
    EEL_ISSUE_MELINA_DATE: Date;

    @Column()
    EEL_MELINA_PLAN: Date;

    @Column()
    EEL_MELINA_FINISH_DATE: Date;

    @Column()
    EEL_FINISH_PLAN: Date;

    @Column()
    EEL_FINISH_DATE: Date;

    @Column()
    EEL_CONFIRMATION: string;

    @Column()
    EEL_CONFIRMATION_DATE: Date;

    @Column()
    EAS_PIC: string;

    @Column()
    EAS_CLASS: string;

    @Column()
    EAS_REMARK_SPEC: string;

    @Column()
    EAS_MELINA_NO: string;

    @Column()
    EAS_ISSUE_MELINA_DATE: Date;

    @Column()
    EAS_MELINA_PLAN: Date;

    @Column()
    EAS_MELINA_FINISH_DATE: Date;

    @Column()
    EAS_FINISH_PLAN: Date;

    @Column()
    EAS_FINISH_DATE: Date;

    @Column()
    EAS_CONFIRMATION: string;

    @Column()
    EAS_CONFIRMATION_DATE: Date;

    @Column()
    CREATED_BY: string;

    @Column()
    CREATED_AT: Date;

    @Column()
    UPDATED_BY: string;

    @Column()
    UPDATED_AT: Date;

    @Column()
    COUNT_ALERT: number;
}