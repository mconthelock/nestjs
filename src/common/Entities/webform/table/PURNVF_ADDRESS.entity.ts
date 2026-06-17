import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { PURNVF_FORM } from './PURNVF_FORM.entity';


@Entity({ name: 'PURNVF_ADDRESS', schema: 'WEBFORM' })
export class PURNVF_ADDRESS{
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

    @PrimaryColumn()
    ADDRID: number;

    @Column()
    ADDRTYPE: string;

    @Column()
    ADDR: string;

    @Column()
    SUBDISTRICT: string;

    @Column()
    DISTRICT: string;

    @Column()
    PROVINCE: string;

    @Column()
    COUNTRY: string;

    @Column()
    POSTCODE: string;

    @ManyToOne(() => PURNVF_FORM, (nvf) => nvf.ADDRESSES)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    MASTER_NVFADDR: PURNVF_FORM;

}
