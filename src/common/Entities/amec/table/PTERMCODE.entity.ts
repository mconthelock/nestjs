import { Column, Entity, PrimaryColumn , OneToMany } from 'typeorm';
import { PURNVF_LIST } from '../../webform/table/PURNVF_LIST.entity'; 

@Entity({ name: 'PTERMCODE', schema: 'AMEC' })
export class PTERMCODE {
    @PrimaryColumn()
    STERMCODE: string;

    @Column()
    STERMDESC: string;

    @OneToMany(() => PURNVF_LIST, (l) => l.TERM)
    LISTS: PURNVF_LIST[];

}




