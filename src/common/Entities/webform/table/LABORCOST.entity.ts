import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'LABORCOST', schema: 'WEBFORM', database: 'webform' })
export class LABORCOST {
    @PrimaryColumn()
    FYEAR: number;

    @PrimaryColumn()
    POSITION: string;

    @Column()
    COST: number;
}
