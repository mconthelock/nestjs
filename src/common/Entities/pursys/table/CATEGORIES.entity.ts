import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'CATEGORIES',
})
export class CATEGORIES {
    @PrimaryColumn()
    CATEGORY_ID: number;

    @Column()
    PARENT_CATEGORY_ID: number;

    @Column()
    CATEGORY_CODE: string;

    @Column()
    CATEGORY_NAME: string;

    @Column()
    CREATED_AT: Date;
}
