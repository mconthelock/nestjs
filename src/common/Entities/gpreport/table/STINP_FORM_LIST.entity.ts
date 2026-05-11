import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'STINP_FORM_LIST', schema: 'GPREPORT' })
export class STINP_FORM_LIST {
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
    NID: number;

    @Column()
    NITEM: number;

    @Column()
    VAREA: string;

    @Column()
    VDETECTED: string;

    @Column()
    NIMAGE: number;

    @Column()
    NIMAGE_AFTER: number;

    @Column()
    NCLASS: number;

    @Column()
    VSUGGESTION: string;

	@Column()
	VEMP_CORRECTIVE: string;

	@Column()
	VCORRECTIVE: string;

	@Column()
	DFINISH_DATE: Date;

	@Column()
	DMORNING_TALK: Date;

	@Column()
	NAUDIT_EVALUATE: number;

	@Column()
	NMAT: number;

	@Column()
	VUSERCREATE: string;

	@Column()
	DDATECREATE: Date;
}
