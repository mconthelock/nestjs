import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity('ORGPOS')
export class Orgpos {
    @PrimaryColumn()
    VPOSNO: string;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    VEMPNO: string;
}
