import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PCURRENCY', schema: 'AMEC' })
export class PCURRENCY {
    @PrimaryColumn()
    SCURCODE: string;

    @Column()
    SCURRENCY: string;

}
