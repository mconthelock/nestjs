import { Column, Entity, OneToOne, PrimaryColumn, Relation } from 'typeorm';
import { CM_SM_FORM } from './CM_SM_FORM.entity';

@Entity({ name: 'DTIH', schema: 'DAILYTECH' })
export class DTIH {
    @PrimaryColumn()
    TINO: string;

    @OneToOne(() => CM_SM_FORM, (form) => form.DTIH)
    CM_SM_FORM: Relation<CM_SM_FORM>;

    @Column()
    RECDT: Date;

    @Column()
    TI_ISSUE_DT: Date;

    @Column()
    SAE_RECDT: Date;

    @Column()
    SAE_PIC: string;

    @Column()
    AGENT: string;

    @Column()
    CTNAME: string;

    @Column()
    PROJ_DESC: string;

    @Column()
    BLANKNO: number;

    @Column()
    UNIT: number;

    @Column()
    URGENT: string;

    @PrimaryColumn()
    REVNO: string;

    @Column()
    PRODTY: string;

    @Column()
    MODEL: string;

    @Column()
    REGT: string;

    @Column()
    GATE: string;

    @Column()
    CAPA: number;

    @Column()
    SPD: number;

    @Column()
    TRAVEL: number;

    @Column()
    OBST: string;

    @Column()
    CWTPT: string;

    @Column()
    AA: number;

    @Column()
    BB: number;

    @Column()
    JJ: number;

    @Column()
    HH: number;

    @Column()
    DOORTY: string;

    @Column()
    HL: number;

    @Column()
    CEILINGTY: string;

    @Column()
    EMERGENCYEXIT: string;

    @Column()
    VENTILATIONFAN: string;

    @Column()
    DECORATIONWEIGHT: number;

    @Column()
    FLOORINGWEIGHT: number;

    @Column()
    PITDEPTH: number;

    @Column()
    OVERHEAD: number;

    @Column()
    CWTSAFETY: string;

    @Column()
    FIREPROOFDOOR: string;

    @Column()
    SHAFTWIDTH: number;

    @Column()
    SHAFTDEPTH: number;

    @Column()
    SPEC_COMPLETED_DT: Date;

    @Column()
    DEADLINE_JV: Date;

    @Column()
    SPLOUTOFSPEC: string;

    @Column()
    PENDINGSPEC: string;

    @Column()
    TQI_STATUS: string;

    @Column()
    ACTION: string;

    @Column()
    ACTIONDT: Date;

    @Column()
    EXP_REPLY_MECH: Date;

    @Column()
    EXP_REPLY_ELEC: Date;

    @Column()
    EXP_REPLY_APPR: Date;

    @Column()
    MECH_REPLY_DT: Date;

    @Column()
    ELEC_REPLY_DT: Date;

    @Column()
    APPR_REPLY_DT: Date;

    @Column()
    EME_PIC: string;

    @Column()
    EEL_PIC: string;

    @Column()
    EAP_PIC: string;

    @Column()
    MECH_INFORM_APPR_DT: Date;

    @Column()
    MECH_INFORM_ELEC_DT: Date;

    @Column()
    ELEC_INFORM_APPR_DT: Date;

    @Column()
    ELEC_INFORM_MECH_DT: Date;

    @Column()
    APPR_INFORM_MECH_DT: Date;

    @Column()
    APPR_INFORM_EEL_DT: Date;

    @Column()
    EXP_REPLY_SAE: Date;

    @Column()
    REPLY_DT: Date;

    @Column()
    ISSUED_TO_MELINA: string;

    @Column()
    REMARK: string;

    @Column()
    LAST_USER: string;

    @Column()
    LAST_UPDATE: string;

    @Column()
    ON_CONSULT: string;

    @Column()
    CONSULT_DETAIL: string;

    @Column()
    SEND_TO_MELINA_DT: Date;

    @Column()
    CONSULTANT: string;

    @Column()
    PRJNO: string;

    @Column()
    PRJNAME: string;

    @Column()
    ORDERNO: string;

    @Column()
    PREPAREBY: string;

    @Column()
    TYPEOFBULIDING: string;

    @Column()
    INQTY: string;
}