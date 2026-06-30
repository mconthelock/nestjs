import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_DOC_REV', schema: 'WORKLOAD' })
export class DPMS_PL_DOC_REV {
    @PrimaryColumn()
    VPROD: string;

    @PrimaryColumn()
    VP: string;

    @PrimaryColumn()
    VTYPE: string;

    @PrimaryColumn()
    VORDERS: string;

    @Column()
    NISSUEREV_ID: number;

    @Column()
    NREV: number;

    @Column()
    VREVTEXT: string;

    @Column()
    DFINISHALL: Date;
}
