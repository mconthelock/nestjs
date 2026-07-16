import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { PSYIC_FORM } from '../../webform/table/PSYIC_FORM.entity';
import { MV_IMM_ITEMMST } from './MV_IMM_ITEMMST.entity';
import { INV_YEARLY_ASSIGN } from './INV_YEARLY_ASSIGN.entity';

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

    @Column()
    WHI_REPLY: string;

    @Column()
    WHI_USER: string;

    @Column()
    PUR_REPLY: string;

    @Column()
    PUR_USER: string;

    @ManyToOne(() => INV_YEARLY_ASSIGN, (a) => a.RESULT)
    @JoinColumn([{ name: 'IYA_ID', referencedColumnName: 'ID' }])
    ASSIGN: INV_YEARLY_ASSIGN;

    @ManyToOne(() => PSYIC_FORM, (f) => f.RESULT)
    @JoinColumn([{ name: 'IYA_ID', referencedColumnName: 'IYA_ID' }])
    FORM: PSYIC_FORM;

    @OneToOne(() => MV_IMM_ITEMMST, (i) => i.YEARLY_RESULT)
    @JoinColumn([{ name: 'ITEM_CODE', referencedColumnName: 'IPROD' }])
    ITEM: MV_IMM_ITEMMST;
}
