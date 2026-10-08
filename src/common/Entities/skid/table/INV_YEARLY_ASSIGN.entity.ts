import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PSYIC_FORM } from '../../webform/table/PSYIC_FORM.entity';
import { INV_YEARLY_RESULT } from './INV_YEARLY_RESULT.entity';
import { AMECUSERALL } from '../../amec/views/AMECUSERALL.entity';

@Entity({ name: 'INV_YEARLY_ASSIGN', schema: 'SKIDCNTRL' })
export class INV_YEARLY_ASSIGN {
    @PrimaryGeneratedColumn({ name: 'ID' })
    ID: number;

    @Column()
    YEAR: string;

    @Column()
    PERIOD: string;

    @Column()
    STATUS: number;

    @Column()
    CREATE_BY: string;

    @Column()
    CREATE_AT: Date;

    @OneToOne(() => AMECUSERALL, (u) => u.INV_YEARLY_ASSIGN)
    @JoinColumn([{ name: 'CREATE_BY', referencedColumnName: 'SEMPNO' }])
    USER: AMECUSERALL;

    @OneToMany(() => INV_YEARLY_RESULT, (r) => r.ASSIGN)
    RESULT: INV_YEARLY_RESULT[];

    @OneToOne(() => PSYIC_FORM, (f) => f.ASSIGN)
    @JoinColumn([{ name: 'ID', referencedColumnName: 'IYA_ID' }])
    FORM: PSYIC_FORM;
}
