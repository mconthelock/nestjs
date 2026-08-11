import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_LAST_REVISION_VIEW', schema: 'WORKLOAD' })
export class DPMS_PL_LAST_REVISION_VIEW {
    @PrimaryColumn()
    VPROD: string;

    @PrimaryColumn()
    VP: string;

    @PrimaryColumn()
    VTYPE: string;

    @PrimaryColumn()
    VORDERS: string;

    @Column()
    VPROBLEM: string;

    @Column()
    VREASON: string;

    @Column()
    DFINISHALL: Date;

    @PrimaryColumn()
    NISSUEREV_ID: number;

    @Column()
    NISSUE_TYPE: number;

    @Column()
    VISSUE_TYPE: string;

    @Column()
    NREV: number;

    @Column()
    VREVTEXT: string;

    @Column()
    NROUND: number;

    @Column()
    NPDFID: number;

    @Column()
    VSHOPORDERNO: string;

    @Column()
    VSUBJECT: string;

    @Column()
    VNAMEOFBLDG: string;

    @Column()
    VSOLDTO: string;

    @Column()
    VSHIPPINGMARK: string;

    @Column()
    DISSUEDATE: Date;
}
