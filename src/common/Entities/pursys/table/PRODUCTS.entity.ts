import {
    Entity,
    Column,
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
    SPRODCODE: string;

    @Column()
    SPRODID: string;

    @Column()
    SEPRODNAME: string;

    @Column()
    SEDESC: string;

    @Column()
    SEUNITCODE: string;

    @Column()
    STPRODNAME: string;

    @Column()
    STDESC: string;

    @Column()
    STUNITCODE: string;

    @Column()
    ACCCODE: string;

    @Column()
    HAZARDNO: string;

    @Column()
    HAZARDSTATUS: string;

    @Column()
    CATEGORY_ID: number;

    @Column()
    IS_ACTIVE: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    CREATED_AT: Date;

    @Column()
    CREATED_BY: string;

    @Column({
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    UPDATE_AT: Date;

    @Column()
    UPDATE_BY: string;

    @Column({ type: 'simple-json', nullable: true, default: {} })
    EXTRA_ATTRIBUTES: Record<string, any>;

    @ManyToOne(() => Categories, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'CATEGORY_ID' })
    category: Categories;
}
