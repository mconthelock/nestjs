import { QainsForm } from "src/webform/qaform/qa-ins/qains_form/entities/qains_form.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('AUDIT_REPORT_MASTER_ALL')
export class AuditReportMasterAll {

    @ViewColumn()
    ARM_SECID:number;	
    
    @ViewColumn()
    ARM_REV:number;	
    
    @ViewColumn()
    ARM_NO:number;

    @ViewColumn()
    ARM_SEQ:number;

    @ViewColumn()
    ARM_DETAIL:string;

    @ViewColumn()
    ARM_TYPE:string;

    @ViewColumn()
    ARM_STATUS:number;

    @ViewColumn()
    ARM_FACTOR?:number;

    @ViewColumn()
    ARM_MAXSCORE?:number;

    @ManyToOne(() => QainsForm, (q) => q.QA_MASTER)
    @JoinColumn({ name: 'ARM_SECID', referencedColumnName: 'QA_INCHARGE_SECTION' })
    @JoinColumn({ name: 'ARM_REV', referencedColumnName: 'QA_REV' })
    QAINS_MASTER: QainsForm | null;

}
