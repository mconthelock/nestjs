import { PurVendorsCode } from 'src/pursys/pur_vendors_code/entities/pur_vendors_code.entity';
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
  VND_LONGNAME: string;

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
  ADDR_BRANCH_CODE: number;

  @Column()
  ADDR_BRANCH_DESC: string;

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

  @Column()
  ADDR_PHONE: string;

  @Column()
  ADDR_WEB: string;
  @OneToMany(() => PurVendorsCode, (code) => code.vendor)
  codes: PurVendorsCode[];

}
