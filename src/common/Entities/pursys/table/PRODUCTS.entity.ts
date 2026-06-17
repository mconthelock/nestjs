import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'PRODUCTS',
})
export class PRODUCTS {
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
}
