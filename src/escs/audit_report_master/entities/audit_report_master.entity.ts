import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: 'AUDIT_REPORT_MASTER', schema: 'ESCCHKSHT' })
export class AuditReportMaster {

    @PrimaryColumn()
    ARM_SECID:number;	
    
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
    ARM_FACTOR?:number;

    @Column()
    ARM_MAXSCORE?:number;
}
