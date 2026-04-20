import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity('RESULT_CONFIRMATION')
export class TaskLogs {
    @PrimaryColumn()
    RC_SECTION: string;

    @PrimaryColumn()
    RC_DATETIME: Date;

    @PrimaryColumn()
    RC_JOBNO: string;

    @Column()
    RC_ACTION: number;

    @Column()
    RC_CONCERN: number;

    @Column()
    RC_CHECKER: string;

    @Column()
    RC_CHECKDATE: Date;
}
