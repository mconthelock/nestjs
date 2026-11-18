import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_DRUM_MASTER',
    schema: 'INNOVAT',
})
export class WHN_DRUM_MASTER {
    @PrimaryColumn()
    GRP_ID: number;

    @PrimaryColumn()
    MT_ITEMCODE: string;

    @Column()
    MT_CABLECODE: string;

    @Column()
    MT_LENGTH: number;

    @Column()
    MT_LSLSPEC: number;

    @Column()
    MT_USERUPDATE: string;

    @Column({
        insert: false,
    })
    MT_DATEUPDATE: Date;
}