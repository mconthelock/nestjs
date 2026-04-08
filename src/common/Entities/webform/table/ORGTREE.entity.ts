import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'ORGTREE', schema: 'WEBFORM' })
export class ORGTREE {
    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    VPARENT: string;

    @Column()
    CSTART: string;
}
