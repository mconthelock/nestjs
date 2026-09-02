import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { TOOL_IMPORT_HISTORY } from "./TOOL_IMPORT_HISTORY.entity";

@Entity({ name: 'TOOL_REFILL', schema: 'SKIDCNTRL' })
export class TOOL_REFILL {
    @PrimaryGeneratedColumn()
    REFILL_ID: number;

    @Column()
    IMPORT_ID: number;

    @Column()
    ROW_NO: number;

    @Column()
    REFILL_DATETIME: Date;

    @Column()
    PRODUCT_ID: string;

    @Column()
    PRODUCT_DESCRIPTION: string;

    @Column()
    STORAGE_LOCATION: string;

    @Column({ type: 'decimal', precision: 18, scale: 3 })
    REFILL_QTY: number;

    @Column({ type: 'decimal', precision: 18, scale: 3 })
    QTY_BEFORE: number;

    @Column({ type: 'decimal', precision: 18, scale: 3 })
    QTY_AFTER: number;

    @Column()
    REFILLER_NAME: string;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    CREATED_AT: Date;

    @Column()
    CREATED_BY: string;

    @ManyToOne(() => TOOL_IMPORT_HISTORY, (ih) => ih.REFILLS)
    @JoinColumn({ name: 'IMPORT_ID' })
    IMPORT_HISTORY: TOOL_IMPORT_HISTORY;

    // Column Name	#	Type	Type Mod	Not Null	Default	Comment
    // REFILL_ID	1	NUMBER	[NULL]	true	"SKIDCNTRL"."ISEQ$$_214637".nextval	
    // IMPORT_ID	2	NUMBER	[NULL]	true	[NULL]	
    // ROW_NO	3	NUMBER	[NULL]	false	[NULL]	
    // REFILL_DATETIME	4	DATE	[NULL]	false	[NULL]	
    // PRODUCT_ID	5	VARCHAR2(100)	[NULL]	false	[NULL]	
    // PRODUCT_DESCRIPTION	6	VARCHAR2(1000)	[NULL]	false	[NULL]	
    // STORAGE_LOCATION	7	VARCHAR2(50)	[NULL]	false	[NULL]	
    // REFILL_QTY	8	NUMBER(18,3)	[NULL]	false	[NULL]	
    // QTY_BEFORE	9	NUMBER(18,3)	[NULL]	false	[NULL]	
    // QTY_AFTER	10	NUMBER(18,3)	[NULL]	false	[NULL]	
    // REFILLER_NAME	11	VARCHAR2(300)	[NULL]	false	[NULL]	
    // CREATED_AT	12	DATE	[NULL]	true	SYSDATE 	
    // CREATED_BY	13	VARCHAR2(10)	[NULL]	false	[NULL]	

}