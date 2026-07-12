import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PSYIC_FORM } from '../../webform/table/PSYIC_FORM.entity';

@Entity({ name: 'INV_YEARLY_RESULT', schema: 'SKIDCNTRL' })
export class INV_YEARLY_RESULT {
    @PrimaryGeneratedColumn({ name: 'ID' })
    ID: number;

    @Column()
    IYA_ID: number;

    @Column()
    TAG_NO: string;

    @Column()
    ITEM_CODE: string;

    @Column()
    ON_HAND: string;

    @Column()
    ADDRESS: string;

    @Column()
    USER_ID: string;

    @Column()
    DESC: string;

    @Column()
    TYPE: string;

    @Column({ type: 'decimal', scale: 2 })
    PRICE: number;

    @Column()
    CREATE_BY: string;

    @Column()
    CREATE_AT: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    ACTUAL_QTY: number;

    @ManyToOne(() => PSYIC_FORM, (f) => f.RESULT)
    @JoinColumn([{ name: 'IYA_ID', referencedColumnName: 'IYA_ID' }])
    FORM: PSYIC_FORM;
}
