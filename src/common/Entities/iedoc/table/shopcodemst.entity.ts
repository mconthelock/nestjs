import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'SHOPCODEMST' })
export class ShopCodeMst {
    @PrimaryColumn({ type: 'varchar2', length: 2 })
    SHOPCODE: string;

    @Column({ type: 'varchar2', length: 70, nullable: true })
    SHOPDESC: string | null;

    @Column({ type: 'varchar2', length: 6, nullable: true })
    PICCODE: string | null;

    @Column({ type: 'varchar2', length: 1, nullable: true })
    STATUS: string | null;
}
