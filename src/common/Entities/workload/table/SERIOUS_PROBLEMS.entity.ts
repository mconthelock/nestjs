import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'SERIOUS_PROBLEMS', schema: 'WORKLOAD' })
export class SeriousProblems {
    @PrimaryGeneratedColumn()
    SP_ID: number;

    @Column()
    SECTION: string;

    @Column()
    TITLE: string;

    @Column()
    DETAIL: string;

    @Column()
    FILE_PATH: string;

    @Column()
    CREATED_BY: string;

    @Column()
    CREATED_AT: Date;

    @Column()
    UPDATED_AT: Date;
}
