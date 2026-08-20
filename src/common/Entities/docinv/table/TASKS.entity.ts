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
    @PrimaryGeneratedColumn()
    TASK_ID: number;

    @Column()
    TASK_DETAIL: string;

    @Column()
    TASK_STATUS: string;

    @Column()
    TASK_PRIORITY: string;

    @Column()
    TASK_DUE_DATE: Date;

    @Column()
    TASK_COMPLETION_DATE: Date;

    @Column()
    TASK_OWNER: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    CREATED_AT: Date;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
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
