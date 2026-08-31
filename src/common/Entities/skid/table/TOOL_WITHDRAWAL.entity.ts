import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { TOOL_IMPORT_HISTORY } from "./TOOL_IMPORT_HISTORY.entity";

@Entity({ name: 'TOOL_WITHDRAWAL', schema: 'SKIDCNTRL' })
export class TOOL_WITHDRAWAL {
    @PrimaryGeneratedColumn()
    WITHDRAWAL_ID: number;

    @Column()
    IMPORT_ID: number;

    @Column()
    PRODUCT_ID: string;

    @Column()
    REQUESTER_NAME: string;

    @Column()
    EMPLOYEE_CODE: string;

    @Column()
    RECORD_DATE: Date;

    @Column()
    WITHDRAW_TIME: string;

    @Column()
    TOOL_DESCRIPTION: string;

    @Column()
    STORAGE_LOCATION: string;

    @Column()
    CATEGORY: string;

    @Column()
    BRAND: string;

    @Column()
    SUPPLIER: string;

    @Column({ type: 'decimal', precision: 18, scale: 3 })
    QUANTITY: number;

    @Column({ type: 'decimal', precision: 18, scale: 4 })
    UNIT_PRICE: number;

    @Column({ type: 'decimal', precision: 18, scale: 2 })
    TOTAL_AMOUNT: number;

    @Column()
    MACHINE: string;

    @Column()
    PO_NO: string;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    CREATED_AT: Date;

    @ManyToOne(() => TOOL_IMPORT_HISTORY, (ih) => ih.WITHDRAWALS)
    @JoinColumn({ name: 'IMPORT_ID' })
    IMPORT_HISTORY: TOOL_IMPORT_HISTORY;
}
