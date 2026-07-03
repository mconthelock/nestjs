import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_ISSUE', schema: 'WORKLOAD' })
export class DPMS_PL_ISSUE {
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

    @Column()
    NDOCREV: number;
}
