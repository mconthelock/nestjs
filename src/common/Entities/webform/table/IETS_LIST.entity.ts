import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryColumn,
} from 'typeorm';
import { IETS_FORM } from './IETS_FORM.entity';
@Entity({ name: 'IETS_LIST', schema: 'WEBFORM' })
export class IETS_LIST {
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
    ID: number;

    @Column()
    DWGNO: string;

    @Column()
    PRTNAME: string;

    @Column()
    ITMNO: string;

    @Column()
    QTY: number;

    @Column()
    PROCESS: string;

    @Column()
    CUR_TP: number;

    @Column()
    CUR_TC: number;

    @Column()
    AF_TP: number;

    @Column()
    AF_TC: number;

    @Column()
    IE_TP: number;

    @Column()
    IE_TC: number;

    @ManyToOne(() => IETS_FORM, (ief) => ief.LISTS)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    IETSFRM: IETS_FORM;
}
