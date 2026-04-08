import { Column, Entity, PrimaryGeneratedColumn , ManyToOne,JoinColumn, Code } from 'typeorm';
import { PurVendor } from '../../pur_vendors/entities/pur_vendor.entity';
@Entity({
  schema: 'PURSYS',
  name: 'PUR_VENDORS_ATTFILE'
})
export class PurVendorsAttfile {
    @PrimaryGeneratedColumn()
    FILE_ID: number;

    @Column()
    FILE_NAME: string;

    @Column()
    UFILE_NAME: string;

     @ManyToOne(() => PurVendor, (vendor) => vendor.VENDOR_ATTFILE,{
      onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'VENDOR_ID' })
    vendor: PurVendor; 
}
