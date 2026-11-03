import { Entity, Column, PrimaryColumn } from 'typeorm';
@Entity({ name: 'PSECTION', schema: 'AMEC' })
export class Psection {
    @PrimaryColumn()
    SSECCODE: string;

    @Column()
    SSECTION: string;

    @Column()
    SSEC: string;
}
