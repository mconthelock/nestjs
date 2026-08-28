import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_ISSUE_REV', schema: 'WORKLOAD' })
export class DPMS_PL_ISSUE_REV {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    VPROD: string;

    @Column()
    VP: string;

    @Column()
    VTYPE: string;

    @Column()
    VORDERS: string;

    @Column()
    NISSUE_TYPE: number;

    @Column()
    NREV: number;

    @Column()
    VREVTEXT: string;

    @Column()
    NROUND: number;

    @Column()
    NPDFID: number;

    @Column()
    NEXCELID: number;

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

    @Column()
    VISSUEBY: string;

    @Column()
    NDOCTYPE: number;
}
