import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DTIH', schema: 'DAILYTECH' })
export class DTIH {
    @PrimaryColumn({ type: 'varchar2', length: 15 })
    TINO: string;

    @Column({ type: 'date', nullable: true })
    RECDT: Date | null;

    @Column({ type: 'date', nullable: true })
    TI_ISSUE_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    SAE_RECDT: Date | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    SAE_PIC: string | null;

    @Column({ type: 'varchar2', length: 6, nullable: true })
    AGENT: string | null;

    @Column({ type: 'varchar2', length: 25, nullable: true })
    CTNAME: string | null;

    @Column({ type: 'varchar2', length: 150, nullable: true })
    PROJ_DESC: string | null;

    @Column({ type: 'number', nullable: true })
    BLANKNO: number | null;

    @Column({ type: 'number', nullable: true })
    UNIT: number | null;

    @Column({ type: 'varchar2', length: 11, nullable: true })
    URGENT: string | null;

    @PrimaryColumn({ type: 'varchar2', length: 5 })
    REVNO: string;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    PRODTY: string | null;

    @Column({ type: 'varchar2', length: 15, nullable: true })
    MODEL: string | null;

    @Column({ type: 'varchar2', length: 50, nullable: true })
    REGT: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    GATE: string | null;

    @Column({ type: 'number', nullable: true })
    CAPA: number | null;

    @Column({ type: 'number', nullable: true })
    SPD: number | null;

    @Column({ type: 'number', nullable: true })
    TRAVEL: number | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    OBST: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    CWTPT: string | null;

    @Column({ type: 'number', nullable: true })
    AA: number | null;

    @Column({ type: 'number', nullable: true })
    BB: number | null;

    @Column({ type: 'number', nullable: true })
    JJ: number | null;

    @Column({ type: 'number', nullable: true })
    HH: number | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    DOORTY: string | null;

    @Column({ type: 'number', nullable: true })
    HL: number | null;

    @Column({ type: 'varchar2', length: 20, nullable: true })
    CEILINGTY: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    EMERGENCYEXIT: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    VENTILATIONFAN: string | null;

    @Column({ type: 'number', nullable: true })
    DECORATIONWEIGHT: number | null;

    @Column({ type: 'number', nullable: true })
    FLOORINGWEIGHT: number | null;

    @Column({ type: 'number', nullable: true })
    PITDEPTH: number | null;

    @Column({ type: 'number', nullable: true })
    OVERHEAD: number | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    CWTSAFETY: string | null;

    @Column({ type: 'varchar2', length: 10, nullable: true })
    FIREPROOFDOOR: string | null;

    @Column({ type: 'number', nullable: true })
    SHAFTWIDTH: number | null;

    @Column({ type: 'number', nullable: true })
    SHAFTDEPTH: number | null;

    @Column({ type: 'date', nullable: true })
    SPEC_COMPLETED_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    DEADLINE_JV: Date | null;

    @Column({ type: 'varchar2', length: 500, nullable: true })
    SPLOUTOFSPEC: string | null;

    @Column({ type: 'varchar2', length: 500, nullable: true })
    PENDINGSPEC: string | null;

    @Column({ type: 'varchar2', length: 15, nullable: true })
    TQI_STATUS: string | null;

    @Column({ type: 'varchar2', length: 15, nullable: true })
    ACTION: string | null;

    @Column({ type: 'date', nullable: true })
    ACTIONDT: Date | null;

    @Column({ type: 'date', nullable: true })
    EXP_REPLY_MECH: Date | null;

    @Column({ type: 'date', nullable: true })
    EXP_REPLY_ELEC: Date | null;

    @Column({ type: 'date', nullable: true })
    EXP_REPLY_APPR: Date | null;

    @Column({ type: 'date', nullable: true })
    MECH_REPLY_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    ELEC_REPLY_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    APPR_REPLY_DT: Date | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    EME_PIC: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    EEL_PIC: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    EAP_PIC: string | null;

    @Column({ type: 'date', nullable: true })
    MECH_INFORM_APPR_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    MECH_INFORM_ELEC_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    ELEC_INFORM_APPR_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    ELEC_INFORM_MECH_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    APPR_INFORM_MECH_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    APPR_INFORM_EEL_DT: Date | null;

    @Column({ type: 'date', nullable: true })
    EXP_REPLY_SAE: Date | null;

    @Column({ type: 'date', nullable: true })
    REPLY_DT: Date | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    ISSUED_TO_MELINA: string | null;

    @Column({ type: 'varchar2', length: 500, nullable: true })
    REMARK: string | null;

    @Column({ type: 'varchar2', length: 5, nullable: true })
    LAST_USER: string | null;

    @Column({ type: 'varchar2', length: 15, nullable: true })
    LAST_UPDATE: string | null;

    @Column({ type: 'varchar2', length: 20, nullable: true })
    ON_CONSULT: string | null;

    @Column({ type: 'varchar2', length: 4000, nullable: true })
    CONSULT_DETAIL: string | null;

    @Column({ type: 'date', nullable: true })
    SEND_TO_MELINA_DT: Date | null;

    @Column({ type: 'varchar2', length: 120, nullable: true })
    CONSULTANT: string | null;

    @Column({ type: 'varchar2', length: 50, nullable: true })
    PRJNO: string | null;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    PRJNAME: string | null;

    @Column({ type: 'varchar2', length: 30, nullable: true })
    ORDERNO: string | null;

    @Column({ type: 'varchar2', length: 70, nullable: true })
    PREPAREBY: string | null;

    @Column({ type: 'varchar2', length: 100, nullable: true })
    TYPEOFBULIDING: string | null;

    @Column({ type: 'varchar2', length: 50, nullable: true })
    INQTY: string | null;
}