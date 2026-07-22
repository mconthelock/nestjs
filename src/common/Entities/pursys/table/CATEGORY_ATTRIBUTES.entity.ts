import { Categories } from './CATEGORIES.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

export enum AttributeType {
    TEXT = 'text',
    NUMBER = 'number',
    OPTION = 'option', // เป็นตัวเลือก (Dropdown/Radio)
}

export enum OptionSource {
    NONE = 'none',
    FIXED = 'fixed',
    FUNCTION = 'function', // กำหนดให้เรียกใช้ Function ที่ Dev ลงทะเบียนไว้
}

@Entity({
    schema: 'PURSYS',
    name: 'CATEGORY_ATTRIBUTES',
})
export class CategoryAttributes {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    CATEGORY_ID: number;

    @Column()
    ATTNAME: string;

    @Column({ type: 'varchar', length: 20, default: AttributeType.TEXT })
    DATA_TYPE: AttributeType;

    @Column()
    IS_REQUIRED: boolean;

    @Column({
        type: 'varchar',
        length: 20,
        enum: OptionSource,
        default: OptionSource.NONE,
    })
    OPTION_SOURCE: string;

    @Column()
    FIXED_OPTIONS: string;

    @Column()
    FUNCTION_NAME: string;

    @ManyToOne(() => Categories, (category) => category.CATEGORY_ID, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'CATEGORY_ID', referencedColumnName: 'CATEGORY_ID' }])
    category: Categories;
}
