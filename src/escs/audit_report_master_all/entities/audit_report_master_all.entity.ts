import { Column, Entity, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('AUDIT_REPORT_MASTER')
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
}
