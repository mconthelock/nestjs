import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'STINP_FORM', schema: 'GPREPORT' })
export class STINP_FORM {
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
    VOWNER: string;

    @Column()
    DDATE: Date;

    @Column()
    VSECTION: string;

    @Column()
    VAUDIT: string;

    @Column()
	VUSERCREATE: string;

	@Column()
	DDATECREATE: Date;
}
