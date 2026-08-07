import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DPMS_PROBLEM_MASTER', schema: 'WORKLOAD' })
export class Problemaster {
    @PrimaryColumn()
    PB_CODE: string;

    @Column()
    PB_COLOR: string;

    @Column()
    PB_DIFINATION: string;

    @Column()
    PB_MEANING: string;

    @Column()
    PRIORITY: number;

    @Column()
    PB_COLOR_CHART: string;

    @Column()
    PB_STATUS: number;
}
