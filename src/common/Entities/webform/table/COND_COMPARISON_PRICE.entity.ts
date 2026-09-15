import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'COND_COMPARISON_PRICE', schema: 'WEBFORM' })
export class COND_COMPARISON_PRICE {
    @PrimaryColumn()
    NO: number;

    @Column()
    DESCRIPTION: string;

    @Column()
    STATUS: number;
}
