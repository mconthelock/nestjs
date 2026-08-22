<<<<<<< HEAD
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TAGS', schema: 'DOCINV' })
export class Tags {
    @PrimaryGeneratedColumn({ name: 'TAG_ID' })
    TAG_ID: number;

    @Column({ name: 'TAG_NAME' })
    TAG_NAME: string;

    @Column({ name: 'TAG_STYLE' })
    TAG_STYLE: string;
=======
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
>>>>>>> fa21ef66295b34ebd7a001042751515b8a5a6f26
}
