import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DPMS_PL_MELT_LOG', schema: 'WORKLOAD' })
export class DPMS_PL_MELT_LOG {
    @PrimaryGeneratedColumn()
    NID: number;

    @Column()
    LOADNO: number;

    @Column()
    VANNDATE: Date;

    @Column()
    AMECLOAD: string;

    @Column()
    CONTAINSIZE: string;

    @Column()
    PROJECT: string;

    @Column()
    ACTUAL_WEIGHT: number;

    @Column()
    SENTDATE: Date;

    @Column()
    LOGBY: string;

    @Column()
    LOGTIME: Date;
}
