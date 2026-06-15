import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'VPCCOST', schema: 'AMECMFG' })
export class Vpccost {
    @PrimaryColumn()
    Q700PURCODE: string;

    @Column()
    Q700PART: string;

    @Column()
    Q700ITEM: string;

    @Column()
    Q700PRICE: number;

    @Column()
    Q700DRAW: string;

    @Column()
    Q700VAR: string;
}
