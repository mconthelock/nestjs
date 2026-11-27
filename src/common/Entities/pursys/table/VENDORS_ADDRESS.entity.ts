import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'VENDORS_ADDRESS', schema: 'PURSYS', database: 'pursys' })
export class VendorsAddress {
    @PrimaryColumn({ type: 'decimal', precision: 38, scale: 0 })
    ADDR_ID: number;

    @Column({ type: 'char', length: 1 })
    ADDR_TYPE: string;

    @Column({ type: 'varchar', length: 200 })
    ADDR_LINE1: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    ADDR_LINE2: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    ADDR_LINE3: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ADDR_SUB_CITY: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ADDR_CITY: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    ADDR_STATE: string;

    @Column({ type: 'varchar', length: 200, nullable: true })
    ADDR_COUNTRY: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    ADDR_ZIPCODE: string;

    @Column({ type: 'decimal', precision: 38, scale: 0 })
    VENDOR_ID: number;
}
