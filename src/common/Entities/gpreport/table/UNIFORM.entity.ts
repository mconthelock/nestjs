import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UNIFORM_CATEGORY } from './UNIFORM_CATEGORY.entity';
@Entity({ name: 'UNIFORM', schema: 'GPREPORT' })
export class UNIFORM {
    @PrimaryGeneratedColumn()
    PROD_ID: number;

    @Column()
    PROD_CODE: string;

    @Column()
    PROD_SIZES: string;

    @Column()
    PROD_WIDTH: string;

    @Column()
    PROD_HEIGHT: string;

    @Column()
    PROD_CATEGORY: number;

    @Column()
    PROD_MIN: number;

    @Column()
    PROD_REMAIN: number;

    @Column()
    PROD_STATUS: string;

    @Column()
    PROD_PRICE: number;

    @Column()
    UPDATE_DATE: Date;

    @Column()
    UPDATE_BY: string;

    @Column()
    PROD_ALOC: number;

    @Column()
    PROD_TYPE: string;

    @ManyToOne(() => UNIFORM_CATEGORY, (c) => c.CATID)
    @JoinColumn({ name: 'PROD_CATEGORY', referencedColumnName: 'CATID' })
    category: UNIFORM_CATEGORY;
}
