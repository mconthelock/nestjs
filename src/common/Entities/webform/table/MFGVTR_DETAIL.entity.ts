import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MFGVTR_FORM } from './MFGVTR_FORM.entity';

@Entity({ name: 'MFGVTR_DETAIL', schema: 'WEBFORM' })
export class MFGVTR_DETAIL {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    FORM_ID: number;

    @Column()
    PRODUCT_ID: string;

    @Column()
    QTY: number;

    @ManyToOne(() => MFGVTR_FORM, (form) => form.DETAILS)
    @JoinColumn({ name: 'FORM_ID' })
    FORM: MFGVTR_FORM;
}
