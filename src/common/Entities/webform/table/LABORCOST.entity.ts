import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'LABORCOST', schema: 'WEBFORM' })
export class LABORCOST {
    @PrimaryColumn()
    FYEAR: number;

    @PrimaryColumn()
    POSITION: string;

    @Column()
    COST: number;
}
