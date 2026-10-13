import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({name: 'PURPRA_REASONS', schema: 'WEBFORM'})
export class PURPRA_REASONS {
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
    NREASON_ID: number;

    @Column()
    VVALUE?: string;

    @Column()
    VFROM?: string;

    @Column()
    VTO?: string;
}