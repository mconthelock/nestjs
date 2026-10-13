import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'PURPRA_FORM', schema: 'WEBFORM' })
export class PURPRA_FORM {
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
    NMODE: number;

    @Column()
    VVENDOR: string;

    @Column()
    VPLANNER: string;

    @Column()
    VMATERIAL_CODE: string;

    @Column()
    VMAKER: string;

    @Column()
    VPART_NAME: string;

    @Column()
    VMODEL_NAME: string;

    @Column()
    VJOB_ITEM: string;

    @Column()
    NCOMMITTEE: number;

    @Column()
    NGROUP: number;

    @Column()
    NTOTAL_PRES: number;

    @Column()
    NTOTAL_NEW: number;

    @Column()
    NTOTAL_COST: number;

    @Column()
    NTOTAL_RATIO: number;

    @Column()
    DEFT_MONTH_START: Date;

    @Column()
    DEFT_MONTH_END: Date;

    @Column()
    VEFT_TYPE: string;

    @Column()
    VEFT_TYPE_OTHER: string;

    @Column()
    VDETAIL?: string;
}
