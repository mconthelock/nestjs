import {
    Column,
    Entity,
    ManyToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Items } from '../../items/entities/items.entity';

@Entity({ name: 'PRICELIST', schema: 'SPSYS' })
export class Pricelist {
    @PrimaryGeneratedColumn({ name: 'PRICE_ID' })
    PRICE_ID: number;

    @Column()
    FYYEAR: number;

    @Column()
    PERIOD: number;

    @Column()
    ITEM: number;

    @Column()
    STATUS: number;

    @Column({ type: 'date', nullable: true })
    STARTIN: Date;

    @Column({ name: 'ENDIN', type: 'date', nullable: true })
    ENDIN: Date | null;

    @Column({ nullable: true })
    INQUIRY: string;

    @Column('decimal', { precision: 10, scale: 2 })
    FCCOST: number;

    @Column('decimal', { precision: 10, scale: 2 })
    FCBASE: number;

    @Column('decimal', { precision: 10, scale: 2 })
    TCCOST: number;

    @Column()
    LATEST: number;

    @Column({ nullable: true })
    CREATE_BY: string;

    @Column({ type: 'date', nullable: true })
    CREATE_AT: Date;

    @ManyToOne(() => Items, (item) => item.prices)
    @JoinColumn({ name: 'ITEM', referencedColumnName: 'ITEM_ID' })
    itemdesc: Items;
}
