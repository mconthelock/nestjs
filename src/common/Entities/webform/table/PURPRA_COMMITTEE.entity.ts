import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURPRA_COMMITTEE', schema: 'WEBFORM' })
export class PURPRA_COMMITTEE {
    @PrimaryColumn()
    NID: number;

    @Column()
    NSEQ: number;

    @Column()
    VCODE: string;

    @Column()
    VNAME: string;
}
