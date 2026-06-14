import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Tree,
    TreeParent,
    TreeChildren,
    OneToMany,
} from 'typeorm';
import { CATEGORY_ATTRIBUTES } from './CATEGORY_ATTRIBUTES.entity';

@Entity({
    schema: 'PURSYS',
    name: 'CATEGORIES',
})
@Tree('adjacency-list')
export class CATEGORIES {
    @PrimaryGeneratedColumn()
    CATEGORY_ID: number;

    @Column()
    CATEGORY_NAME: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    CREATED_AT: Date;

    @TreeParent()
    PARENT: CATEGORIES;

    @TreeChildren()
    CHILDREN: CATEGORIES[];

    @OneToMany(() => CATEGORY_ATTRIBUTES, (attribute) => attribute.category, {
        cascade: true,
    })
    attributes: CATEGORY_ATTRIBUTES[];
}
