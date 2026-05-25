import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PTERMCODE', schema: 'AMEC' })
export class PTERMCODE {
    @PrimaryColumn()
    STERMCODE: string;

    @Column()
    STERMDESC: string;

}
