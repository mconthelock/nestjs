import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('AUDIT_REPORT_MASTER')
export class AuditReportMaster {

    @PrimaryColumn()
    ARM_REV:number;	
    
    @PrimaryColumn()
	ARM_NO:number;

    @PrimaryColumn()
	ARM_SEQ:number;

    @Column()
	ARM_DETAIL:string;

    @Column()
	ARM_TYPE:string;

    @Column()
	ARM_STATUS:number;

    @Column()
    ARM_SCORE?:number;
}
