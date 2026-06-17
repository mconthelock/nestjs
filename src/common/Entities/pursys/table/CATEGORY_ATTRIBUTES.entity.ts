import { CATEGORIES } from './CATEGORIES.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'CATEGORY_ATTRIBUTES',
})
export class CATEGORY_ATTRIBUTES {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    CATEGORY_ID: number;

    @Column()
    ATTNAME: string;

    @Column()
    DATA_TYPE: string;

    @Column()
    IS_REQUIRED: boolean;

    @Column()
    OPTION_SOURCE: string;

    @Column()
    FIXED_OPTIONS: string;

    @Column()
    FUNCTION_NAME: string;

    @ManyToOne(() => CATEGORIES, (category) => category.CATEGORY_ID, {
        onDelete: 'CASCADE',
    })
    category: CATEGORIES;
}
