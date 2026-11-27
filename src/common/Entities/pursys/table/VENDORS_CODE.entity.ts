import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'VENDORS_CODE', schema: 'PURSYS', database: 'pursys' })
export class VendorsCode {
    @PrimaryGeneratedColumn()
    CODE_ID: number;

    @Column()
    CODE_NUM: number;

    @Column()
    VENDOR_ID: number;

    @Column()
    CODE_STATUS: number;

    @Column()
    CODE_REGDATE: Date;

    @Column()
    CODE_CURRENCY: string;

    @Column()
    CODE_SHIP: number;

    @Column()
    CODE_PAY: string;

    @Column()
    CODE_TYPE: number;
}
