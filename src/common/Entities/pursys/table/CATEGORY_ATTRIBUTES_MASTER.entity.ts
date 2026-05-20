import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    schema: 'PURSYS',
    name: 'CATEGORY_ATTRIBUTES_MASTER',
})
export class CATEGORY_ATTRIBUTES_MASTER {
    @PrimaryColumn()
    ATTRIBUTE_ID: number;

    @Column()
    ATTRIBUTE_CODE: string;

    @Column()
    ATTRIBUTE_LABEL: string;

    @Column()
    DATA_TYPE: string;

    @Column()
    UNIT: string;
}
