import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { PURNVF_LIST } from '../../webform/table/PURNVF_LIST.entity';
import { PurVendorsCode } from './pur_vendors_code.entity';
import { PUREVA_FORM } from '../../webform/table/PUREVA_FORM.entity';

@Entity({ name: 'TERM_PAYMENT', schema: 'PURSYS' })
export class TermPayment {
    @PrimaryColumn()
    STERMCODE: string;

    @Column()
    STERMDESC: string;

    @Column()
    TERMMAP: string;

    @OneToMany(() => PURNVF_LIST, (l) => l.TERM)
    LISTS: PURNVF_LIST[];

    @OneToMany(() => PurVendorsCode, (l) => l.TERM)
    LISTSMST: PurVendorsCode[];

    @OneToMany(() => PUREVA_FORM, (l) => l.TERM)
    LISTSPUREVA: PUREVA_FORM[];
}
