import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Tags } from './TAGS.entity';

@Entity({ name: 'TASKS', schema: 'DOCINV' })
export class Tasks {
    @PrimaryGeneratedColumn({ name: 'TASK_ID' })
    TASK_ID: number;

    @Column({ name: 'TASK_DETAIL' })
    TASK_DETAIL: string;

    @Column({ name: 'TASK_STATUS' })
    TASK_STATUS: string;

    @Column({ name: 'TASK_PRIORITY' })
    TASK_PRIORITY: string;

    @Column({ name: 'TASK_DUE_DATE', nullable: true })
    TASK_DUE_DATE: Date;

    @Column({ name: 'TASK_COMPLETION_DATE', nullable: true })
    TASK_COMPLETION_DATE: Date;

    @Column({ name: 'TASK_OWNER' })
    TASK_OWNER: string;

    @Column({ name: 'CREATED_AT', default: () => 'CURRENT_TIMESTAMP' })
    CREATED_AT: Date;

    @Column({ name: 'UPDATED_AT', default: () => 'CURRENT_TIMESTAMP' })
    UPDATED_AT: Date;

    @ManyToMany(() => Tags, (tag) => tag.TAG_ID, { cascade: true })
    @JoinTable({
        name: 'TASKS_TAG',
        schema: 'DOCINV',
        joinColumn: { name: 'TASK_ID', referencedColumnName: 'TASK_ID' },
        inverseJoinColumn: { name: 'TAG_ID', referencedColumnName: 'TAG_ID' },
    })
    tags: Tags[];
}
