import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_ORIGIN', schema: 'WORKLOAD' })
export class DPMS_PL_ORIGIN {
    @PrimaryColumn()
    VPROD: string;

    @PrimaryColumn()
    VP: string;

    @Column()
    VTYPE: string;

    @PrimaryColumn()
    VORDERS: string;

    @PrimaryColumn()
    VCASE: string;

    @PrimaryColumn()
    VITEM: string;

    @Column()
    VPART: string;

    @PrimaryColumn()
    VDRAWING: string;

    @Column({ nullable: true })
    VDRAWINGL?: string;

    @Column()
    VORIGIN: string;
}
