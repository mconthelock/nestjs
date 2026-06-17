import { PurVendorsCode } from 'src/common/Entities/pursys/table/pur_vendors_code.entity';
import { PurVendorsAddress } from 'src/common/Entities/pursys/table/pur_vendors_address.entity';
import { PurVendorsAttfile } from 'src/common/Entities/pursys/table/pur_vendors_attfile.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
@Entity({
    schema: 'PURSYS',
    name: 'PUR_VENDORS',
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

    @Column()
    VND_TYPE: number;

    @Column()
    VND_REGDATE: Date;

    @Column()
    VND_LASTUPDATE: Date;

    @Column()
    VND_STATUS: number;

    @Column()
    VND_USERUPDATE: number;

    @Column()
    ADDR_PHONE: string;

    @Column()
    ADDR_WEB: string;

    @Column()
    EMAIL: string;

    @Column()
    FAX: string;

    @Column()
    BANKNAME: string;

    @Column()
    BRANCH: string;

    @Column()
    ACCNUMBER: string;

    @OneToMany(() => PurVendorsCode, (code) => code.vendor, {
        cascade: true,
    })
    VENDOR_CODES: PurVendorsCode[];

    @OneToMany(() => PurVendorsAddress, (address) => address.vendor, {
        cascade: true,
    })
    VENDOR_ADDRESS: PurVendorsAddress[];

    @OneToMany(() => PurVendorsAttfile, (attfile) => attfile.vendor, {
        cascade: true,
    })
    VENDOR_ATTFILE: PurVendorsAttfile[];
}
