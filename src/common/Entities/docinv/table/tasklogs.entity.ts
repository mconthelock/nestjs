import { Column, Entity, PrimaryColumn } from 'typeorm';
@Entity({ name: 'RESULT_CONFIRMATION', schema: 'DOCINV' })
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
