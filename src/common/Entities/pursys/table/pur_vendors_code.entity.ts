import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
    Code,
} from 'typeorm';
import { PurVendor } from './pur_vendor.entity';
import { PTERMCODE } from '../../amec/table/PTERMCODE.entity';
@Entity({
    schema: 'PURSYS',
    name: 'PUR_VENDORS_CODE',
})
export class PurVendorsCode {
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

    @ManyToOne(() => PurVendor, (vendor) => vendor.VENDOR_CODES, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'VENDOR_ID' })
    vendor: PurVendor;

    @OneToOne(() => PTERMCODE)
    @JoinColumn({ name: 'CODE_PAY', referencedColumnName: 'STERMCODE' })
    TERM: PTERMCODE;  


}
