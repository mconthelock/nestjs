import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Tree,
    TreeParent,
    TreeChildren,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { CategoryAttributes } from './CATEGORY_ATTRIBUTES.entity';
@Entity({
    schema: 'PURSYS',
    name: 'CATEGORIES',
})
@Tree('adjacency-list')
export class Categories {
    @PrimaryGeneratedColumn()
    CATEGORY_ID: number;

    @Column()
    CATEGORY_NAME: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    CREATED_AT: Date;

    @TreeParent()
    @JoinColumn({ name: 'PARENT_ID', referencedColumnName: 'CATEGORY_ID' })
    PARENT_ID: Categories;

    @TreeChildren()
    CHILDREN: Categories[];

    @OneToMany(() => CategoryAttributes, (attribute) => attribute.category, {
        cascade: true,
    })
    @JoinColumn([{ name: 'CATEGORY_ID', referencedColumnName: 'CATEGORY_ID' }])
    attributes: CategoryAttributes[];
}
