import { Column, Entity, PrimaryGeneratedColumn , ManyToOne,JoinColumn, Code } from 'typeorm';
import { PurVendor } from '../../pur_vendors/entities/pur_vendor.entity';
@Entity({
  schema: 'PURSYS',
  name: 'PUR_VENDORS_CODE'
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

    @Column({ type: 'date' })
    CODE_REGDATE: string;

    @Column()
    CODE_CURRENCY: string;

    @Column()
    CODE_SHIP: number;

    @Column()
    CODE_PAY: string;

    @Column()
    CODE_TYPE: number;

    @ManyToOne(() => PurVendor, (vendor) => vendor.codes,{
      onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'VENDOR_ID' })
    vendor: PurVendor;  
}