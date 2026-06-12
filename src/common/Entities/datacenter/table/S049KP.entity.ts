import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'S049KP', schema: 'AMECMFG' })
export class S049KP {
    @PrimaryColumn()
    S49K01: string;

    @PrimaryColumn()
    S49K02: string;

    @PrimaryColumn()
    S49K03: string;

    @PrimaryColumn()
    S49K04: string;
}
