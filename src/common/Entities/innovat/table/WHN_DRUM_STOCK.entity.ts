import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_DRUM_STOCK',
    schema: 'INNOVAT',
})
export class WHN_DRUM_STOCK {
    @PrimaryColumn()
    ST_ITEMCODE: string;

    @PrimaryColumn()
    ST_PROD: string;

    @PrimaryColumn()
    ST_ID: number;

    @Column()
    ST_LENMASTER: number;

    @Column()
    ST_LENREMAIN: number;

    @Column()
    ST_CABLECODE: string;

    @Column()
    ST_RECIVEDATE: Date;

    @Column()
    ST_USERUPDATE: string;

    @Column()
    ST_DATEUPDATE: Date;

    @Column()
    ST_STATUS: number;
}