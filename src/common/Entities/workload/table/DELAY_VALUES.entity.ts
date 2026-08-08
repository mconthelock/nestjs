import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'DELAY_VALUES', schema: 'WORKLOAD' })
export class DelayValues {
    @PrimaryColumn()
    CAUSE_ID: string;

    @PrimaryColumn()
    PERIOD_YM: string;

    @PrimaryColumn()
    SECTION: string;

    @Column()
    DELAY_VALUE: string;

    @Column()
    UPDATED_BY: string;

    @Column()
    UPDATED_AT: string;
}
