import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'STOCK_MOVEMENTS', schema: 'PURSYS' })
export class StockMovements {
    @PrimaryGeneratedColumn()
    MOVEMENT_ID: number;

    @Column()
    DOCUMENT_NO: string;

    @Column()
    MOVEMENT_TYPE: string;

    @Column()
    SOURCE_STORAGE: number;

    @Column()
    DEST_STORAGE: number;

    @Column()
    STATUS: string;

    @Column()
    CREATED_AT: Date;
}
