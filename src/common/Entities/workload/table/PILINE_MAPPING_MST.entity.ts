import {
    Column,
    Entity,
    PrimaryColumn,
    Unique,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { PILINE_CAUSE_MST } from './PILINE_CAUSE_MST.entity';
import { PILINE_EVENT_MST } from './PILINE_EVENT_MST.entity';
import { PILINE_LOCATION_MST } from './PILINE_LOCATION_MST.entity';
import { PILINE_PROBLEM_MST } from './PILINE_PROBLEM_MST.entity';

@Entity({ name: 'PILINE_MAPPING_MST', schema: 'WORKLOAD' })
@Unique('UK_PILINE_MAPPING', ['LOCATION_ID', 'CAUSE_ID', 'PROBLEM_ID'])
export class PILINE_MAPPING_MST {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_MAPPING' })
    MAP_ID: number;

    @Column()
    LOCATION_ID: number;

    @Column()
    CAUSE_ID: number;

    @Column()
    PROBLEM_ID: number;

    @Column()
    EVENT_ID: number;

    @Column({ default: '1' })
    STATUS: string;

    @ManyToOne(() => PILINE_CAUSE_MST, { nullable: false })
    @JoinColumn({
        name: 'CAUSE_ID',
        referencedColumnName: 'CAUSE_ID',
        foreignKeyConstraintName: 'FK_PILINE_MAP_CAUSE',
    })
    CAUSE: PILINE_CAUSE_MST;

    @ManyToOne(() => PILINE_EVENT_MST, { nullable: false })
    @JoinColumn({
        name: 'EVENT_ID',
        referencedColumnName: 'EVENT_ID',
        foreignKeyConstraintName: 'FK_PILINE_MAP_EVENT',
    })
    EVENT: PILINE_EVENT_MST;

    @ManyToOne(() => PILINE_LOCATION_MST, { nullable: false })
    @JoinColumn({
        name: 'LOCATION_ID',
        referencedColumnName: 'LOCATION_ID',
        foreignKeyConstraintName: 'FK_PILINE_MAP_LOCATION',
    })
    LOCATION: PILINE_LOCATION_MST;

    @ManyToOne(() => PILINE_PROBLEM_MST, { nullable: false })
    @JoinColumn({
        name: 'PROBLEM_ID',
        referencedColumnName: 'PROBLEM_ID',
        foreignKeyConstraintName: 'FK_PILINE_MAP_PROBLEM',
    })
    PROBLEM: PILINE_PROBLEM_MST;
}
