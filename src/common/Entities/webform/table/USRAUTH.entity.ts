import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'USRAUTH', schema: 'WEBFORM' })
export class USRAUTH {
    @PrimaryColumn()
    VEMPNO: string;

    @PrimaryColumn()
    NFRMNO: number;

    @PrimaryColumn()
    VORGNO: string;

    @PrimaryColumn()
    CYEAR: string;

    @Column()
    CAUTHNO: string;
}
