import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TASKS_TAG', schema: 'DOCINV' })
export class TasksTag {
    @PrimaryColumn()
    TASK_ID: number;

    @PrimaryColumn()
    TAG_ID: number;
}
