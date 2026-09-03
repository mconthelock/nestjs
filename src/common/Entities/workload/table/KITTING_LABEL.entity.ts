import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'KITTING_LABEL', schema: 'WORKLOAD' })
export class KITTING_LABEL {
    @PrimaryColumn()
    ORDER_NO: string;

    @PrimaryColumn()
    PACKING_NO: string;

    @PrimaryColumn()
    PRINT_SEQ: number;

    @Column()
    PRINT_QTY: number;

    @PrimaryColumn()
    QR_CODE: string;

    @Column()
    PRINT_STATUS: number;

    @Column()
    CREATE_AT: Date;

    @Column()
    CONFIRM_BY: string;

    @Column()
    CONFIRM_AT: Date;
}
