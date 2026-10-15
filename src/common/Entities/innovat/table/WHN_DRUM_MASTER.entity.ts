import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'WHN_DRUM_MASTER',
    schema: 'INNOVAT',
})
export class WHN_DRUM_MASTER {
    @PrimaryColumn()
    MT_ITEMCODE: string;

    @Column()
    GRP_ID: number;

    @Column()
    MT_CABLECODE: string;

    @Column()
    MT_LENGTH: number;

    @Column()
    MT_LSLSPEC: number;

    @Column()
    MT_USERUPDATE: string;

    @Column()
    MT_CREATEDATE: Date;
}