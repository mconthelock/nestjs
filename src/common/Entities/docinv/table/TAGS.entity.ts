import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Tasks } from './TASKS.entity';

@Entity({ name: 'TAGS', schema: 'DOCINV' })
export class Tags {
    @PrimaryGeneratedColumn()
    TAG_ID: number;

    @Column()
    TAG_NAME: string;

    @Column()
    TAG_STYLE: string;

    @ManyToMany(() => Tasks, (task) => task.tags)
    tasks: Tasks[];
}
