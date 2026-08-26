import {
    Entity,
    PrimaryColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';

import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { PURNVF_ADDRESS } from './PURNVF_ADDRESS.entity';

@Entity({ name: 'PURVMM_FORM', schema: 'WEBFORM' })
export class PURVMM_FORM {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    REQTYPE: string;

    @Column()
    VENDCODE: string;

    @Column()
    VENDNAME: string;

    @Column()
    VENDGROUPTYPE: string;

    @Column()
    TAXID: string;

    @Column()
    CANO: string;

    @Column()
    BANO: string;

    @Column()
    CURCODE: string;

    @Column()
    PAYMENTTYPE: string;

    @Column()
    VENDHOLD: string;

    @Column()
    VENDONETIME: string;

    @Column()
    VEND1099: string;

    @Column()
    TERMCODE: string;

    @Column()
    SEARCHKEY: string;

    @Column()
    FISCALCODE: string;

    @Column()
    ACCNUMBER: string;

    @Column()
    BANKNAME: string;

    @Column()
    BRANCH: string;

    @ManyToOne(() => Vendors, (vendor) => vendor.PURVMM)
    @JoinColumn({ name: 'VENDCODE', referencedColumnName: 'VND_CODE' })
    VENDER: Vendors;

    @OneToOne(() => FORM)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    FORM: FORM;

    @OneToMany(() => PURNVF_ADDRESS, (address) => address.purvmmForm)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    ADDRESSES: PURNVF_ADDRESS[];
}
