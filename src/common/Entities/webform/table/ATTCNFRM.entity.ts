import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ATTCNFRM', schema: 'WEBFORM' })
export class ATTCNFRM {
    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @PrimaryColumn()
    ITEMNO: number;

    @PrimaryColumn()
    TYPENO: number;

    @Column()
    SFILE: string;

    @Column()
    SEMPNO: string;
}
