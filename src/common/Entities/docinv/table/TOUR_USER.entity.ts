import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TOUR_USER', schema: 'DOCINV' })
export class TOUR_USER {
    @PrimaryColumn()
    EMPNO: string;

    @PrimaryColumn()
    TOUR_KEY: string;

    @Column({type: 'decimal'})
    TOUR_VERSION?: number;

    @Column()
    DATECREATE?: Date;

    @Column()
    DATEUPDATE?: Date;
}
