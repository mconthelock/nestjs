import {
    Entity,
    Column,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Categories } from './CATEGORIES.entity';

@Entity({
    schema: 'PURSYS',
    name: 'PRODUCTS',
})
export class Products {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    SKU: string;

    @Column()
    NAME: string;

    @Column()
    DESCRIPTION: string;

    @Column()
    CATEGORY_ID: number;

    @Column()
    CREATED_AT: string;

    @Column()
    UPDATED_AT: string;

    @Column()
    DELETED_AT: string;

    @Column({ type: 'simple-json', nullable: true, default: {} })
    EXTRA_ATTRIBUTES: Record<string, any>;

    @ManyToOne(() => Categories, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'category_id' })
    category: Categories;
}
