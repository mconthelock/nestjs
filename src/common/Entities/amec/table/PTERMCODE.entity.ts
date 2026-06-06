import { Column, Entity, PrimaryColumn , OneToMany } from 'typeorm';
import { PURNVF_LIST } from '../../webform/table/PURNVF_LIST.entity'; 
import { PurVendorsCode } from '../../pursys/table/pur_vendors_code.entity';

@Entity({ name: 'PTERMCODE', schema: 'AMEC' })
export class PTERMCODE {
    @PrimaryColumn()
    STERMCODE: string;

    @Column()
    STERMDESC: string;

    @OneToMany(() => PURNVF_LIST, (l) => l.TERM)
    LISTS: PURNVF_LIST[];

    @OneToMany(() => PurVendorsCode, (l) => l.TERM)
    LISTSMST: PurVendorsCode[];

}




