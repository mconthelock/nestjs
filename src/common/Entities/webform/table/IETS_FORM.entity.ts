import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { IETS_LIST } from './IETS_LIST.entity';
import { VORGMST } from '../views/VORGMST.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

@Entity({ name: 'IETS_FORM', schema: 'WEBFORM' })
export class IETS_FORM {
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
    JUNG: string;

    @Column()
    TSORGNO: string;

    @ManyToOne(() => VORGMST)
    @JoinColumn([{ name: 'TSORGNO', referencedColumnName: 'VORGNO' }])
    ORG: VORGMST;

    @OneToMany(() => IETS_LIST, (l) => l.IETSFRM)
    LISTS: IETS_LIST[];

    @OneToOne(() => FORM)
    @JoinColumn({ name: 'NFRMNO', referencedColumnName: 'NFRMNO' })
    @JoinColumn({ name: 'VORGNO', referencedColumnName: 'VORGNO' })
    @JoinColumn({ name: 'CYEAR', referencedColumnName: 'CYEAR' })
    @JoinColumn({ name: 'CYEAR2', referencedColumnName: 'CYEAR2' })
    @JoinColumn({ name: 'NRUNNO', referencedColumnName: 'NRUNNO' })
    FORM: FORM;
}
