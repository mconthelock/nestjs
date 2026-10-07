import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'SHOPCODEMST' })
export class ShopCodeMst {
    @PrimaryColumn()
    SHOPCODE: string;

    @Column()
    SHOPDESC: string | null;

    @Column()
    PICCODE: string | null;

    @Column()
    STATUS: string | null;
}