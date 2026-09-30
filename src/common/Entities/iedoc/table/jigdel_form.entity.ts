import { Column, Entity, PrimaryColumn } from 'typeorm';

// The five-key foreign key to WEBFORM.FORM is managed by the database.
@Entity({ name: 'JIGDEL_FORM' })
export class JigDelForm {
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
    JIG_NO: string;

    @Column()
    REASON: string | null;

    @Column()
    DETAIL: string | null;
}