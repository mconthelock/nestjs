import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { PUREVA_FORM } from '../../webform/table/PUREVA_FORM.entity';



@Entity({ name: 'PCURRENCY', schema: 'AMEC' })
export class PCURRENCY {
    @PrimaryColumn()
    SCURCODE: string;

    @Column()
    SCURRENCY: string;

    @OneToMany(() => PUREVA_FORM, (l) => l.STDCUR)
    LISTSPUREVA: PUREVA_FORM[];

}
