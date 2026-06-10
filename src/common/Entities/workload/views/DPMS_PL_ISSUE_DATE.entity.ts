import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_ISSUE_DATE', schema: 'WORKLOAD' })
export class DPMS_PL_ISSUE_DATE {
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
    DCOMPLETE: Date;

    @Column()
    DDRAFT: Date;

    @Column()
    DPARTIAL: Date;

    @Column()
    DCOMBINE: Date;

    @Column()
    DBALANCE: Date;
}