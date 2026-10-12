import {
    Column,
    Entity,
    PrimaryColumn,
    Unique,
    Check,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { PILINE_CAUSE_MST } from './PILINE_CAUSE_MST.entity';
import { PILINE_INITIAL_MST } from './PILINE_INITIAL_MST.entity';
import { PILINE_LOCATION_MST } from './PILINE_LOCATION_MST.entity';
import { PILINE_PROBLEM_MST } from './PILINE_PROBLEM_MST.entity';

@Entity({ name: 'PILINE_EVENT_RECORD', schema: 'WORKLOAD' })
@Unique('UK_PILINE_EVENT_RUN', ['EVENT_DATE', 'RUN_NO'])
@Check('CK_PILINE_EVENT_NG', "IS_NG IN ('0','1')")
export class PILINE_EVENT_RECORD {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_EVENT_RECORD' })
    PILINE_NO: string;

    @Column()
    EVENT_DATE: Date;

    @Column()
    RUN_NO: number;

    @Column()
    SHIFT: string;

    @Column()
    START_TIME: Date;

    @Column()
    END_TIME: Date;

    @Column()
    LOCATION_ID: number;

    @Column({ nullable: true })
    SSECCODE: string | null;

    @Column()
    CAUSE_ID: number;

    @Column()
    PROBLEM_ID: number;

    @Column()
    INITIAL_ID: number;

    @Column({ nullable: true })
    DETAIL: string | null;

    @Column({ default: '0' })
    IS_NG: string;

    @Column({ nullable: true })
    REF_RN_CYEAR2: string | null;

    @Column({ nullable: true })
    REF_RN_NRUNNO: number | null;

    @Column({ nullable: true })
    REMARK: string | null;

    @Column({ nullable: true })
    RECORD_STATUS: string | null;

    @Column()
    CREATE_BY: string;

    @Column({ default: () => 'SYSTIMESTAMP' })
    CREATE_DATE: Date;

    @Column({ nullable: true })
    UPDATE_BY: string | null;

    @Column({ nullable: true })
    UPDATE_DATE: Date | null;

    @ManyToOne(() => PILINE_CAUSE_MST, { nullable: false })
    @JoinColumn({
        name: 'CAUSE_ID',
        referencedColumnName: 'CAUSE_ID',
        foreignKeyConstraintName: 'FK_PILINE_EVENT_CAUSE',
    })
    CAUSE: PILINE_CAUSE_MST;

    @ManyToOne(() => PILINE_INITIAL_MST, { nullable: false })
    @JoinColumn({
        name: 'INITIAL_ID',
        referencedColumnName: 'INITIAL_ID',
        foreignKeyConstraintName: 'FK_PILINE_EVENT_INITIAL',
    })
    INITIAL: PILINE_INITIAL_MST;

    @ManyToOne(() => PILINE_LOCATION_MST, { nullable: false })
    @JoinColumn({
        name: 'LOCATION_ID',
        referencedColumnName: 'LOCATION_ID',
        foreignKeyConstraintName: 'FK_PILINE_EVENT_LOCATION',
    })
    LOCATION: PILINE_LOCATION_MST;

    @ManyToOne(() => PILINE_PROBLEM_MST, { nullable: false })
    @JoinColumn({
        name: 'PROBLEM_ID',
        referencedColumnName: 'PROBLEM_ID',
        foreignKeyConstraintName: 'FK_PILINE_EVENT_PROBLEM',
    })
    PROBLEM: PILINE_PROBLEM_MST;
}
