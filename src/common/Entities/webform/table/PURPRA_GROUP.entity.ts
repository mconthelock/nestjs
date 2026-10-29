import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURPRA_GROUP', schema: 'WEBFORM' })
export class PURPRA_GROUP {
    @PrimaryColumn()
    NID: number;

    @Column()
    NSEQ: number;

    @Column()
    VNAME: string;
}
