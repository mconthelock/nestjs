import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';

@Entity({ name: 'CNFORM', schema: 'WEBFORM' })
export class CNFORM {
    // --- Primary Keys ---

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
    TITLE: string;

    @Column()
    ITEMNO: string;

    @Column()
    SVENDNAME: string;

    @Column()
    CLSNO: number;

    @Column()
    RSNNO: number;

    @Column()
    RSNOTHER: string;

    @Column()
    PRDCTNAME: string;

    @Column()
    DETTRANS: string;

    @Column()
    BEFCHANGE: string;

    @Column()
    AFTCHANGE: string;

    @Column()
    SUBMITDATE: Date;

    @Column()
    INSPECDATE: Date;

    @Column()
    EXPCHGDATE: Date;

    @Column()
    INSPECRESULT: string;

    @Column()
    JDGMNTNO: number;

    @Column()
    INSPECRECNO: string;

    @Column()
    PRTNAME: string;

    @Column()
    PURITEM: string;

    @Column()
    INVNO: string;

    @Column()
    ORDQ: number;

    @Column()
    JDGOTHER: string;

    @Column()
    PRTLOC: string;

    @Column()
    TRANSNO: string;

    @Column()
    RQCNREF: string;

    @Column()
    ORDERNO: string;

    @Column()
    MDATE: Date;

    @Column()
    MSTATUS: string;

    @OneToOne(() => FORM)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    FORM: FORM;
}
