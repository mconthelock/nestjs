import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'INV_CHECK_RESULT', schema: 'SKIDCNTRL' })
export class INV_CHECK_RESULT {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    ASSIGN_ID: number;

    @Column()
    ITEM_CODE: string;

    @Column()
    GROUP_CODE: string;

    @Column()
    CONTROLLER_ID: string;

    @Column({ type: 'float', nullable: true })
    ON_HAND: number;

    @Column({ type: 'float', nullable: true })
    ACTUAL_QTY: number;

    @Column({ type: 'float', nullable: true })
    DIFF: number;

    @Column()
    RANDOM_CHECK: string;

    @Column({ nullable: true })
    REMARK: string;

    @Column({ type: 'date', nullable: true })
    CHECK_DATE: Date;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    CREATED_AT: Date;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    UPDATED_AT: Date;

    @Column({ nullable: true, default: 'CONTROLLER' })
    CHECKER_ROLE: string;

    @Column({ nullable: true })
    LEADER_ID: string;

    @Column({ nullable: true })
    LEADER_REMARK: string;

    @Column({ type: 'date', nullable: true })
    LAST_UPDATED: Date;

    @Column({ type: 'float', nullable: true })
    RECHECK_QTY: number;

    @Column({ nullable: true })
    RECHECK_REMARK: string;
}
