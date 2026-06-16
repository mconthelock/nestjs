import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { INV_HALFYEAR_RESULT } from './INV_HALFYEAR_RESULT.entity';

@Entity({ name: 'INV_CHECK_LOG', schema: 'SKIDCNTRL' })
export class INV_CHECK_LOG {
    @PrimaryGeneratedColumn()
    LOG_ID: number;

    @Column()
    ASSIGN_ID: number;

    @Column()
    REPORT_ID: number;

    @Column()
    ITEM_CODE: string;

    @Column({ type: 'float', nullable: true })
    OLD_VALUE: number;

    @Column({ type: 'float', nullable: true })
    NEW_VALUE: number;

    @Column()
    EDIT_BY: string;

    @Column({ nullable: true })
    REMARK: string;

    @Column({ nullable: true })
    TYPE: number;

    @Column({ type: 'date', default: () => 'SYSDATE' })
    EDIT_AT: Date;

    @ManyToOne(() => INV_HALFYEAR_RESULT, (f2) => f2.LOGS)
    @JoinColumn([{ name: 'REPORT_ID', referencedColumnName: 'ID' }])
    RESULT: INV_HALFYEAR_RESULT;
}
