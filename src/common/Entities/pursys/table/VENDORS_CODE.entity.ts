import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'VENDORS_CODE', schema: 'PURSYS', database: 'pursys' })
export class VendorsCode {
    @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
    CODE_ID: number;

    @Column({ type: 'decimal', precision: 38, scale: 0 })
    CODE_NUM: number;

    @Column({ type: 'decimal', precision: 38, scale: 0, nullable: true })
    VENDOR_ID: number;

    @Column({ type: 'decimal', precision: 38, scale: 0, default: 1 })
    CODE_STATUS: number;

    @Column({ type: 'datetime', nullable: true })
    CODE_REGDATE: Date;

    @Column({ type: 'char', length: 3, nullable: true })
    CODE_CURRENCY: string;

    @Column({ type: 'decimal', precision: 38, scale: 0, nullable: true })
    CODE_SHIP: number;

    @Column({ type: 'varchar', length: 8, nullable: true })
    CODE_PAY: string;

    @Column({ type: 'decimal', precision: 38, scale: 0, nullable: true })
    CODE_TYPE: number;
}
