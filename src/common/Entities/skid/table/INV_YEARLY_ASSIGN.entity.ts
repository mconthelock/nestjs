import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PSYIC_FORM } from '../../webform/table/PSYIC_FORM.entity';

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

    @OneToOne(() => PSYIC_FORM, (f) => f.ASSIGN)
    @JoinColumn([{ name: 'ID', referencedColumnName: 'IYA_ID' }])
    FORM: PSYIC_FORM;
}
