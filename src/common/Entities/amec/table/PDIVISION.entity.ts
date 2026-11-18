import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PDIVISION', schema: 'AMEC' })
export class Pdivision {
    @PrimaryColumn()
    SDIVCODE: string;

    @Column()
    SDIVISION: string;

    @Column()
    SDIV: string;
}
