import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'UNIFORM_RIGHT', schema: 'GPREPORT' })
export class UNIFORM_RIGHT {
    @PrimaryColumn()
    EMPCOD: string;

    @Column()
    RIGHTQTY: number;

    @Column()
    POLOSUIT: string;

    @Column()
    SHORTSUIT: string;

    @Column()
    LONGSUIT: string;

    @Column()
    OFFICESUIT: string;

    @Column()
    JUMPSUIT: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    DISCOUNT: number;
}
