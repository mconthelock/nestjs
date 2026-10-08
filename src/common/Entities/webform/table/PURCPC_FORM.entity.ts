import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURCPC_FORM', schema: 'WEBFORM' })
export class PURCPC_FORM {
    @PrimaryColumn()
    CYEAR2: string;

    @PrimaryColumn()
    NRUNNO: number;

    @Column()
    VREQNO: string;

    @Column()
    VINPUTER: string;

    @Column()
    DREQDATE: Date;

    @Column()
    NFUNCTIONS: number;

    @Column()
    NSTATUS: number;
}
