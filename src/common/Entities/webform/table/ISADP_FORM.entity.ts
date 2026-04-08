import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
    name: 'ISADP_FORM',
    schema: 'WEBFORM',
})
export class ISADP_FORM {
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
    PLANYEAR: number;

    @PrimaryColumn()
    REQ_DIV: string;

    @Column()
    USER_REQ: number;

    @Column()
    DEV_PLAN: number;

    @Column()
    MANHOUR: number;

    @Column()
    COST: number;
}
