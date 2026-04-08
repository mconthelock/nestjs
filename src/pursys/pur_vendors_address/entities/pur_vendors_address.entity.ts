import { Column, Entity, PrimaryGeneratedColumn , ManyToOne,JoinColumn, Code } from 'typeorm';
import { PurVendor } from '../../pur_vendors/entities/pur_vendor.entity';
@Entity({
  schema: 'PURSYS',
  name: 'PUR_VENDORS_ADDRESS'
})
export class PurVendorsAddress {
    @PrimaryGeneratedColumn()
    ADDR_ID: number;

    @Column()
    ADDR_TYPE: string;

    @Column()
    ADDR_LINE1: string;

    @Column()
    ADDR_LINE2: string; 
    
    @Column()
    ADDR_LINE3: string; 

    @Column()
    ADDR_CITY: string;

    @Column()
    ADDR_STATE: string;

    @Column()
    ADDR_COUNTRY: number;

    @Column()
    ADDR_ZIPCODE: string;

    @ManyToOne(() => PurVendor, (vendor) => vendor.VENDOR_ADDRESS,{
      onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'VENDOR_ID' })
    vendor: PurVendor;  
}