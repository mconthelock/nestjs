import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TURNOVER_UNIT', schema: 'WORKLOAD' })
export class Turnoverunit {
    @PrimaryColumn()
    ID: number;

    @Column()
    PERIOD: number;

    @Column()
    MONTHYEAR: string;

    @Column()
    PLAN_VALUE: number;

    @Column()
    ACTUAL_VALUE: number;

    @Column()
    CREATED_AT: Date;

    @Column()
    UPDATED_AT: Date;
}
