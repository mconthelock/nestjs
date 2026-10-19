import { Column, Entity, PrimaryColumn, Unique } from 'typeorm';

@Entity({ name: 'PILINE_PROBLEM_MST', schema: 'WORKLOAD' })
@Unique('UK_PILINE_PROBLEM', ['PROBLEM_NAME'])
export class PILINE_PROBLEM_MST {
    @PrimaryColumn({ primaryKeyConstraintName: 'PK_PILINE_PROBLEM' })
    PROBLEM_ID: number;

    @Column()
    PROBLEM_NAME: string;

    @Column({ default: '1' })
    STATUS: string;
}
