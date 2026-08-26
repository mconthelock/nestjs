import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'F001KP',
    schema: 'ESCCHKSHT',
})
export class F001KP {
    @PrimaryColumn()
    F01R01: string;

    @Column()
    F01R02: string;

    @Column()
    F01R03: string;

    @Column()
    F01R04: string;

    @Column()
    F01R05: string;

    @Column()
    F01R06: string;

    @Column()
    F01R07: string;
}