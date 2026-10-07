import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DPMS_PL_ISSUE_TYPE } from './DPMS_PL_ISSUE_TYPE.entity';

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

    @OneToOne(() => DPMS_PL_ISSUE_TYPE, (issueType) => issueType.NID)
    @JoinColumn({ name: 'NISSUE_TYPE', referencedColumnName: 'NID' })
    ISSUE_TYPE: DPMS_PL_ISSUE_TYPE;
}
