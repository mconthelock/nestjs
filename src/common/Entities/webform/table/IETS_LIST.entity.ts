import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { IETS_FORM } from './IETS_FORM.entity';
import { DWGNOTICEPICMST } from './DWGNOTICEPICMST.entity';
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

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    CUR_TP: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    CUR_TC: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    AF_TP: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    AF_TC: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    IE_TP: number;

    @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
    IE_TC: number;

    @ManyToOne(() => IETS_FORM, (ief) => ief.LISTS)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    IETSFRM: IETS_FORM;

    @ManyToOne(() => DWGNOTICEPICMST)
    @JoinColumn({ name: 'ITMNO', referencedColumnName: 'ITEMNO' })
    PICMST: DWGNOTICEPICMST;
}
