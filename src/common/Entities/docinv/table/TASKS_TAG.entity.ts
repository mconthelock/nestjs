import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TASKS_TAG', schema: 'DOCINV' })
export class TasksTag {
    @PrimaryColumn({ name: 'TASK_ID' })
    TASK_ID: number;

    @PrimaryColumn({ name: 'TAG_ID' })
    TAG_ID: number;
}
