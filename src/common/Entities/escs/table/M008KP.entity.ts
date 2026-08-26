import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'M008KP',
    schema: 'ESCCHKSHT',
})
export class M008KP {
    @PrimaryColumn()
    M8K01: string;

    @PrimaryColumn()
    M8K02: string;

    @PrimaryColumn()
    M8K03: string;

    @Column()
    M8K04: number;
}