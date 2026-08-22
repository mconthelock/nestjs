import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'WAREHOUSES', schema: 'PURSYS' })
export class Warehouses {
    @PrimaryGeneratedColumn()
    WHID: number;

    @Column()
    WHCODE: string;

    @Column()
    WHNAME: string;

    @Column()
    WHOWNER: string;

    @Column()
    LOCATION: string;

    @Column()
    IS_ACTIVE: string;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    CREATED_AT: Date;

    @Column()
    CREATED_BY: string;

    @Column({
        type: 'timestamp',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    UPDATED_AT: Date;

    @Column()
    UPDATED_BY: string;
}
