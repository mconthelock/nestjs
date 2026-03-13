import { PurVendorsCode } from 'src/pursys/pur_vendors_code/entities/pur_vendors_code.entity';
import { PurVendorsAddress } from 'src/pursys/pur_vendors_address/entities/pur_vendors_address.entity';
import { PurVendorsAttfile  } from 'src/pursys/pur_vendors_attfile/entities/pur_vendors_attfile.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
@Entity({
  schema: 'PURSYS',
  name: 'PUR_VENDORS'
})
export class PurVendor {
  @PrimaryGeneratedColumn()
  VND_ID: number;

  @Column()
  VND_NAME: string;

  @Column()
  VND_TNAME: string;

  @Column()
  VND_SALE: string;

  @Column({ type: 'number', default: 1 })
  VND_TYPE: number;

  @Column({ type: 'date' })
  VND_REGDATE: string;

  @Column({ type: 'date' })
  VND_LASTUPDATE: string;

  @Column()
  VND_STATUS: number;

  @Column()
  VND_USERUPDATE: number;

  @Column()
  ADDR_PHONE: string;

  @Column()
  ADDR_WEB: string;
  @OneToMany(() => PurVendorsCode, (code) => code.vendor,{
    cascade: true,
  })
  VENDOR_CODES: PurVendorsCode[];

  @OneToMany(() => PurVendorsAddress, (address) => address.vendor,{
    cascade: true,
  })
  VENDOR_ADDRESS: PurVendorsAddress[];

  @OneToMany(() => PurVendorsAttfile, (attfile) => attfile.vendor,{
    cascade: true,
  })
  VENDOR_ATTFILE: PurVendorsAttfile[];

}
