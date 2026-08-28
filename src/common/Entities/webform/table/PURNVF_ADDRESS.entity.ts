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
import { PUREVA_FORM } from './PUREVA_FORM.entity';
import { PURVMM_FORM } from './PURVMM_FORM.entity';

@Entity({ name: 'PURNVF_ADDRESS', schema: 'WEBFORM' })
export class PURNVF_ADDRESS {
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
    ADDR1: string;

    @Column()
    ADDR2: string;

    @Column()
    CITY: string;

    @Column()
    STATE: string;

    @Column()
    COUNTRY: string;

    @Column()
    POSTCODE: string;

    @ManyToOne(() => PURNVF_FORM, (nvf) => nvf.ADDRESSES, {
        createForeignKeyConstraints: false, // <--- เพิ่มตรงนี้
    })
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    MASTER_NVFADDR: PURNVF_FORM;

    @ManyToOne(() => PUREVA_FORM, (eva) => eva.ADDRESSES, {
        createForeignKeyConstraints: false, // <--- เพิ่มตรงนี้
    })
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    MASTER_EVAADDR: PUREVA_FORM;

    @ManyToOne(() => PURVMM_FORM, (vmm) => vmm.ADDRESSES, {
        createForeignKeyConstraints: false, // <--- เพิ่มตรงนี้
    })
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    purvmmForm: PURVMM_FORM;
}
