import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'S020KP', schema: 'AMECMFG' })
export class S020KP {
    @PrimaryColumn()
    S20K01: string;

    @PrimaryColumn()
    S20K02: string;

    @PrimaryColumn()
    S20K03: string;
}
