import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TOUR', schema: 'DOCINV' })
export class TOUR {
    @PrimaryColumn()
    KEY: string;

    @Column()
    NAME: string;

    @Column({type: 'decimal'})
    VERSION: number;

    @Column()
    DATECREATE: Date;
}
