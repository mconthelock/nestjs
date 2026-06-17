import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PSCIH_FORM } from '../../webform/table/PSCIH_FORM.entity';
import { INV_CHECK_LOG } from './PSINV_CHECK_LOG.entity';
import { ImmItemmst } from '../views/imm_itemmst.entity';
import { MV_IMM_ITEMMST } from './MV_IMM_ITEMMST.entity';

@Entity({ name: 'INV_HALFYEAR_RESULT', schema: 'SKIDCNTRL' })
export class INV_HALFYEAR_RESULT {
    @PrimaryGeneratedColumn()
    ID: number;

    @Column()
    REPORT_ID: number;

    @Column()
    SOURCE_RESULT_ID: number;

    @Column()
    SOURCE_ASSIGN_ID: number;

    @Column()
    ITEM_CODE: string;

    @Column()
    GROUP_CODE: string;

    @Column()
    CONTROLLER_ID: string;

    @Column()
    LEADER_ID: string;

    @Column({ type: 'float', nullable: true })
    ON_HAND: number;

    @Column({ type: 'float', nullable: true })
    ORIGINAL_ACTUAL_QTY: number;

    @Column({ type: 'float', nullable: true })
    ACTUAL_QTY: number;

    @Column({ type: 'float', nullable: true })
    DIFF: number;

    @Column({ nullable: true })
    ORIGINAL_RANDOM_CHECK: string;

    @Column({ nullable: true })
    RANDOM_CHECK: string;

    @Column({ nullable: true })
    ORIGINAL_REMARK: string;

    @Column({ nullable: true })
    REMARK: string;

    @Column({ nullable: true })
    ORIGINAL_LEADER_REMARK: string;

    @Column({ nullable: true })
    LEADER_REMARK: string;

    @Column({ type: 'date', nullable: true })
    CHECK_DATE: Date;

    @Column({ nullable: true })
    LAST_UPDATED: string;

    @Column({ type: 'date', nullable: true, default: () => 'SYSDATE' })
    CREATED_AT: Date;

    @Column({ type: 'date', nullable: true })
    UPDATED_AT: Date;

    @ManyToOne(() => PSCIH_FORM, (f) => f.RESULT)
    @JoinColumn([{ name: 'REPORT_ID', referencedColumnName: 'REPORT_ID' }])
    FORM: PSCIH_FORM;

    @OneToOne(() => MV_IMM_ITEMMST, (i) => i.RESULT)
    @JoinColumn([{ name: 'ITEM_CODE', referencedColumnName: 'IPROD' }])
    ITEM_DETAIL: MV_IMM_ITEMMST;

    @OneToMany(() => INV_CHECK_LOG, (f2) => f2.RESULT)
    @JoinColumn([
        { name: 'REPORT_ID', referencedColumnName: 'REPORT_ID' },
        { name: 'ITEM_CODE', referencedColumnName: 'ITEM_CODE' },
    ])
    LOG_EDIT: INV_CHECK_LOG[];
}