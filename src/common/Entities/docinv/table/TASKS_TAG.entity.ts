import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'TASKS_TAG', schema: 'DOCINV' })
export class TasksTag {
<<<<<<< HEAD
    @PrimaryColumn({ name: 'TASK_ID' })
    TASK_ID: number;

    @PrimaryColumn({ name: 'TAG_ID' })
=======
    @PrimaryColumn()
    TASK_ID: number;

    @PrimaryColumn()
>>>>>>> fa21ef66295b34ebd7a001042751515b8a5a6f26
    TAG_ID: number;
}
