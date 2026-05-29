import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'CATEGORY_ATTRIBUTES',
})
export class CATEGORY_ATTRIBUTES {
    @PrimaryColumn()
    CATEGORY_ID: number;

    @Column()
    ATTRIBUTE_ID: number;
}
