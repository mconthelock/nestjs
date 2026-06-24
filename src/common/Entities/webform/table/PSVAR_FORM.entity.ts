import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PSVAR_FORM', schema: 'WEBFORM' })
export class PSVAR_FORM {
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

    @Column()
    REPORT_ID: number;
}
